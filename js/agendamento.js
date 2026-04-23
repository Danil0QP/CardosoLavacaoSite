const URL_BASE_API = [
    "http://localhost:8080",
    "https://cardosolavacao.rf.gd"
];

const PLANOS = {
    UNICO: "unico",
    MENSAL: "mensal"
};

const SERVICOS_POR_PLANO = {
    [PLANOS.UNICO]: [
        { id: "unico-simples", label: "Lavação simples", valor: 60 },
        { id: "unico-cera", label: "Lavação com cera", valor: 90 }
    ],
    [PLANOS.MENSAL]: [
        { id: "mensal-simples", label: "Lavação simples (mensal)", valor: 220 },
        { id: "mensal-cera", label: "Lavação com cera (mensal)", valor: 320 }
    ]
};

let listaCompletaAgendamento = [];

document.addEventListener("DOMContentLoaded", () => {
    configurarFormularioAgendamento();
    configurarFiltros();
    carregarAgendamentos();
});

async function configurarFormularioAgendamento() {
    const selectCarro = document.getElementById("opcao-carro");
    const selectPlano = document.getElementById("opcao-plano");
    const selectServico = document.getElementById("opcao-servico");
    const botaoAgendar = document.getElementById("confirmaAgendamento");
    const botaoCancelar = document.getElementById("cancelaAgendamento");

    if (!selectCarro || !selectPlano || !selectServico || !botaoAgendar || !botaoCancelar) {
        return;
    }

    await popularCarrosCliente(selectCarro);
    normalizarOpcoesPlano(selectPlano);

    selectPlano.addEventListener("change", () => {
        popularServicosPorPlano(selectPlano.value, selectServico);
    });

    botaoAgendar.addEventListener("click", async () => {
        const payload = construirPayloadAgendamento(selectCarro, selectPlano, selectServico);
        if (!payload) {
            return;
        }

        const criado = await enviarAgendamento(payload);

        if (!criado) {
            alert("Não foi possível concluir o agendamento agora.");
            return;
        }

        alert("Agendamento criado com sucesso!");
        limparFormularioAgendamento(selectPlano, selectServico);
        carregarAgendamentos();
    });

    botaoCancelar.addEventListener("click", () => {
        limparFormularioAgendamento(selectPlano, selectServico, true);
    });
}

function construirPayloadAgendamento(selectCarro, selectPlano, selectServico) {
    const dataInput = document.getElementById("data");
    const horaInput = document.getElementById("hora");

    const veiculoSelecionado = selectCarro.value;
    const planoSelecionado = selectPlano.value;
    const servicoSelecionado = selectServico.value;
    const data = dataInput?.value;
    const hora = horaInput?.value;

    if (!veiculoSelecionado || !planoSelecionado || !servicoSelecionado || !data || !hora) {
        alert("Preencha carro, plano, serviço, data e hora para continuar.");
        return null;
    }

    const servico = obterServicoPorPlano(planoSelecionado, servicoSelecionado);
    const clienteId = localStorage.getItem("clienteId");

    return {
        clienteId: clienteId ? Number(clienteId) : null,
        carro: veiculoSelecionado,
        plano: planoSelecionado,
        servicoId: servico.id,
        servico: servico.label,
        valor: servico.valor,
        dia: data,
        hora,
        statusAgendamento: "PENDENTE"
    };
}

function normalizarOpcoesPlano(selectPlano) {
    const opcoesValidas = [
        { value: "", text: "Selecione um plano" },
        { value: PLANOS.UNICO, text: "Único" },
        { value: PLANOS.MENSAL, text: "Mensal" }
    ];

    selectPlano.innerHTML = opcoesValidas
        .map((opcao) => `<option value="${opcao.value}">${opcao.text}</option>`)
        .join("");
}

async function popularCarrosCliente(selectCarro) {
    selectCarro.innerHTML = "<option value=''>Carregando veículos...</option>";

    const clienteId = localStorage.getItem("clienteId");
    if (!clienteId) {
        selectCarro.innerHTML = "<option value=''>Faça login para escolher um carro</option>";
        return;
    }

    const caminhos = [
        `/clientes/${clienteId}/veiculos`,
        `/${clienteId}/veiculos`,
        `/cliente/${clienteId}`,
        `/clientes/${clienteId}`
    ];

    try {
        const resposta = await buscarPrimeiroRetornoValido(caminhos);
        const veiculos = normalizarVeiculosCliente(resposta);

        selectCarro.innerHTML = "<option value=''>Escolha o carro</option>";

        if (veiculos.length === 0) {
            selectCarro.innerHTML += "<option value=''>Nenhum veículo encontrado no cadastro</option>";
            return;
        }

        veiculos.forEach((veiculo) => {
            const descricao = [veiculo.marca, veiculo.nomeCarro, veiculo.placa].filter(Boolean).join(" • ");
            const option = document.createElement("option");
            option.value = descricao;
            option.textContent = descricao || "Veículo sem descrição";
            selectCarro.appendChild(option);
        });
    } catch (error) {
        selectCarro.innerHTML = "<option value=''>Não foi possível carregar os veículos</option>";
    }
}

async function buscarPrimeiroRetornoValido(caminhos) {
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

            return await response.json();
        } catch (error) {
            ultimoErro = error;
        }
    }

    throw ultimoErro || new Error("Nenhum endpoint de veículo retornou dados válidos.");
}

function normalizarVeiculosCliente(data) {
    if (Array.isArray(data)) {
        return data.map(mapearVeiculo).filter((item) => item.nomeCarro || item.placa || item.marca);
    }

    if (Array.isArray(data?.veiculos)) {
        return data.veiculos.map(mapearVeiculo).filter((item) => item.nomeCarro || item.placa || item.marca);
    }

    if (typeof data === "object" && data !== null) {
        const unico = mapearVeiculo(data);
        if (unico.nomeCarro || unico.placa || unico.marca) {
            return [unico];
        }
    }

    return [];
}

function mapearVeiculo(item = {}) {
    return {
        marca: item.marca || item.marcaCarro || "",
        nomeCarro: item.nomeCarro || item.carro || item.modelo || "",
        placa: item.placa || item.placaCarro || ""
    };
}

function popularServicosPorPlano(plano, selectServico) {
    const servicos = SERVICOS_POR_PLANO[plano] || [];

    selectServico.innerHTML = "<option value=''>Escolha um serviço</option>";

    servicos.forEach((servico) => {
        const option = document.createElement("option");
        option.value = servico.id;
        option.textContent = `${servico.label} - R$ ${servico.valor.toFixed(2).replace(".", ",")}`;
        selectServico.appendChild(option);
    });
}

function obterServicoPorPlano(plano, servicoId) {
    const servico = (SERVICOS_POR_PLANO[plano] || []).find((item) => item.id === servicoId);

    if (!servico) {
        return { id: "indefinido", label: "Serviço não identificado", valor: 0 };
    }

    return servico;
}

function limparFormularioAgendamento(selectPlano, selectServico, limparDataHora = false) {
    const selectCarro = document.getElementById("opcao-carro");

    if (selectCarro) {
        selectCarro.value = "";
    }

    selectPlano.value = "";
    selectServico.innerHTML = "<option value=''>Escolha um serviço</option>";

    if (limparDataHora) {
        const dataInput = document.getElementById("data");
        const horaInput = document.getElementById("hora");

        if (dataInput) {
            dataInput.value = "";
        }

        if (horaInput) {
            horaInput.value = "";
        }
    }
}

async function enviarAgendamento(payload) {
    const endpoints = ["/agendamento", "/agendamentos", "/criar-agendamento"];

    for (const baseUrl of URL_BASE_API) {
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(`${baseUrl}${endpoint}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    return true;
                }
            } catch (error) {
                // tenta próxima combinação
            }
        }
    }

    const pendentes = JSON.parse(localStorage.getItem("agendamentosPendentes") || "[]");
    pendentes.push({ id: Date.now(), ...payload });
    localStorage.setItem("agendamentosPendentes", JSON.stringify(pendentes));
    return true;
}

function configurarFiltros() {
    const inputFiltro = document.getElementById("filtro-cliente");
    const botaoLimpar = document.getElementById("btn-limpar-filtro");
    const botaoAtualizar = document.getElementById("btn-atualizar");

    if (!inputFiltro || !botaoLimpar || !botaoAtualizar) {
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

    const caminhos = tipoUsuario === "ADMIN"
        ? ["/listaAgendamentos", "/agendamento"]
        : [`/${clienteId}/agendamento`, `/clientes/${clienteId}/agendamentos`];

    try {
        listaCompletaAgendamento = await buscarEmEndpoints(caminhos);
    } catch (error) {
        const pendentes = JSON.parse(localStorage.getItem("agendamentosPendentes") || "[]");
        listaCompletaAgendamento = pendentes;
    }

    aplicarFiltros();
}

async function buscarEmEndpoints(caminhos) {
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

    const termo = ((inputFiltro?.value) || "").trim().toLowerCase();

    const listaFiltrada = listaCompletaAgendamento.filter((agendamento) => {
        if (!termo) {
            return true;
        }

        const nomeCliente = (agendamento.nomeCliente || agendamento.nome || "").toLowerCase();
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

    if (!tabela) {
        return;
    }

    if (!Array.isArray(lista) || lista.length === 0) {
        tabela.innerHTML = "<tr><td colspan='7'>Nenhum agendamento encontrado.</td></tr>";
        return;
    }

    const html = lista.map((agendamento) => `
    <tr>
        <td>${agendamento.id ?? "-"}</td>
        <td>${agendamento.nomeCliente || agendamento.nome || "-"}</td>
        <td>${agendamento.dia ?? "-"}</td>
        <td>${agendamento.hora ?? "-"}</td>
        <td>${agendamento.servico || agendamento.serviço || agendamento.nomeServico || "-"}</td>
        <td>${agendamento.statusAgendamento ?? "-"}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary" onclick="editarAgendamento(${agendamento.id})" title="Editar status"><i class="bi bi-pen"></i></button>
            <button class="btn btn-sm btn-outline-danger" onclick="deletarAgendamento(${agendamento.id})" title="Cancelar"><i class="bi bi-x-circle"></i></button>
        </td>
    </tr>
    `).join("");

    tabela.innerHTML = html;
}

function editarAgendamento(id) {
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