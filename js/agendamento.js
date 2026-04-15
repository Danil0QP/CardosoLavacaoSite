const URL_BASE_API = [
    "http://localhost:8080",
    "https://cardosolavacao.rf.gd"
];

let listaCompletaAgendamento = [];

document.addEventListener("DOMContentLoaded", () => {
    configurarFiltros();
    carregarAgendamentos();
});

function configurarFiltros() {
    const inputFiltro = document.getElementById("filtro-cliente");
    const botaoLimpar = document.getElementById("btn-limpar-filtro");
    const botaoAtualizar = document.getElementById("btn-atualizar");

    if (!inputFiltro || !botaoLimpar || botaoAtualizar) {
        return;
    }

    inputFiltro.addEventListener("input", aplicarFiltros);

    botaoLimpar.addEventListener("click", () => {
        inputFiltro.value = "";
        aplicarFiltros();
    });

    botaoAtualizar.addEventListener("click", carregarAgendamentos);
}

async function carregarAgendamentos() {
    const tipoUsuario = localStorage.getItem("tipoUsuario");
    const clienteId = localStorage.getItem("clienteId");

    if (tipoUsuario !== "ADMIN" && !clienteId) {
        mostrarResumo(0, 0, "Você precisa estar conectado para consultar seus agendamentos.");
        mostrarAgendamento([]);
        return;
    }

    const caminhos = tipoUsuario === "ADMIN" ? ["/listaAgendamentos", "/agendamento"] : [`/${clienteId}/agendamento`, `/clientes/${clienteId}/agendamentos`];

    try {
        listaCompletaAgendamento = await buscarEmEndpoits(caminhos);
        aplicarFiltros();
    } catch (error) {
        console.error("Erro ao carregar os agendamentos: ", error);
        mostrarResumo(0, 0, "Erro ao carregar os agendamentos no momento.");
        mostrarAgendamento([]);
    }
}

async function buscarEmEndpoits(caminhos) {
    const urls = [];

    caminhos.forEach((caminho) => {
        URL_BASE_API.forEach((baseUrl) => {
            urls.push(`${baseUrl}${caminho}`);
        });
    });

    let ultimoErro = null;

    for (const url of urls) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                continue;
            }

            const data = await response.json();
            if (Array.isArray(data)) {
                return data;
            }
        } catch (error) {
            ultimoErro = error;
        }
    }

    throw ultimoErro || new Error("Nenhum endpoint retornou dados válidos.");
}


function aplicarFiltros() {
    const inputFiltro = document.getElementById("filtro-cliente");
    const termo = (document.getElementById("filtro-cliente").value || "").trim().toLowerCase();

    const listaFiltrada = listaCompletaAgendamento.filter((agendamento) => {
        if (!termo) {
            return true;
        }

        const nomeCliente = (agendamento.nomeCliente || "").toLowerCase();
        return nomeCliente.includes(termo);
    });

    mostrarResumo(listaFiltrada.length, listaCompletaAgendamento.length);
    mostrarAgendamento(listaFiltrada);
}

function mostrarResumo(totalFiltrado, totalGeral, mensagem = "") {
    const resumo = document.getElementById("resumo-lista");
    if (!resumo) {
        return;
    }
    if (mensagem) {
        resumo.textContent = mensagem;
        return;
    }

    resumo.textContent = `Exibindo ${totalFiltrado} de ${totalGeral} agendamento(s).`;
}

function mostrarAgendamento(lista) {
    const tabela = document.getElementById("tabela-agendamento");

    if(!tabela) {
        return;
    }

    if (!Array.isArray(lista) || lista.length === 0) {
        tabela.innerHTML = "<tr><td colspan='7'>Nenhum agendamento encontrado.</td></tr>";
        return;
    }

    const html = lista.map((agendamento) => `
    <tr>
        <td>${agendamento.id ?? "-"}</td>
        <td>${agendamento.nomeCliente ?? "-"}</td>
        <td>${agendamento.dia ?? "-"}</td>
        <td>${agendamento.hora ?? "-"}</td>
        <td>${agendamento.serviço || agendamento.nomeServico || "-"}</td>
        <td>${agendamento.statusAgendamento ?? "-"}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary" onclick="editarAgendamento(${agendamento.id}) title="Editar status"><i class="bi bi-pen></i></button>
            <button class="btn btn-sm btn-outline-danger" onclick="deletarAgendamento(${agendamento.id})" title="Cancelar"><i class="bi bi-x-circle"></i></button>
        </td>
    </tr>
    `).join("");

    tabela.innerHTML = html;
}

function editar(id) {
    const novoStatus = prompt("Escolha o novo status");

    if (!novoStatus) {
        return;
    }

    fetch(`http://localhost:8080/agendamentos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: novoStatus })
    })
        .then((response) => {
            if (response.ok) {
                alert("Status atualizado!");
                carregarAgendamentos();
            }
        });

}

async function deletarAgendamento(id) {
    if (!confirm("Tem certeza que deseja excluir este agendamento?")) {
        return;
    }

    const rotas = [
        `/${id}/agendamento`,
        `/agendamento/${id}`
    ];

    let excluido = false;

    for (const rota of rotas) {
        for (const baseUrl of URL_BASE_API) {
            try {
                const response = await fetch(`${baseUrl}${rota}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    excluido = true;
                    break;
                }
            } catch (error) {
                // tenta próxima URL
            }
        }

        if (excluido) {
            break;
        }
    }

    if (!excluido) {
        alert("Não foi possível excluir o agendamento no momento.");
        return;
    }

    listaCompletaAgendamento = listaCompletaAgendamento.filter((item) => item.id !== id);
    aplicarFiltros();
}