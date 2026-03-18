document.addEventListener("DOMContentLoaded", function () {
    buscarAgendamento();
});

function buscarAgendamento() {
    let tipoUsuario = localStorage.getItem("tipoUsuario");
    let clienteId = localStorage.getItem("clienteId");
    let endpoint = "";

    if (tipoUsuario === "ADMIN") {
        endpoint = "/listaAgendamentos";
    } else {
        endpoint = `/${clienteId}/agendamento`;
    }

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            mostrarAgendamento(data);
        })
        .catch(error => {
            console.error("Erro ao carregar os agendamentos:", error);
        });
}

function mostrarAgendamento(lista) {
    let tabela = document.getElementById("tabelaAgendamento");
    tabela.innerHTML = "";

    lista.forEach(agendamento => {
        html +=
            `<tr>
                <td>${agendamento.id}</td>
                <td>${agendamento.nomeCliente}</td>
                <td>${agendamento.dia}</td>
                <td>${agendamento.hora}</td>
                <td>${agendamento.servico}</td>
                <td>${agendamento.status}</td>
                <td>
                    <button onclick="editar(${agendamento.id})"><i class="bi bi-pen"></i>
                    <button onclick="cancelar(${agendamento.id})"><i class="bi bi-x-circle"></i>
                </td>            
            </tr>`;
    });

    tabela.innerHTML = html;
}

function editar(id) {
    let novoStatus = prompt("Escolha o novo status: ");

    fetch(`http://localhost:8080/agendamentos`)({
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: novoStatus
        })
    })
        .then(response => {
            if (response.ok) {
                alert("Status atualizado!");
                location.reload();
            }
        });

}

function cancelar(id) {
    if (!confirm("Deseja realmente cancelar o agendamento?")) {
        return;
    }

    fetch(`http://localhost:8080/agendamento/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                alert("Agendamento cancelado com sucesso " + id + "!");
                location.reload();
            } else {
                alert("Erro ao cancelar agendamento!");
            }
        });
}