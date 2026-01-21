let acaoCancelarCadastro = null;
let modalAnterior = null;

//Evento para confirmar o cancelamento
document.addEventListener("click", (event) => {

    if (event.target.id === "confirmarCancelamento") {
        if (typeof acaoCancelarCadastro === "function") {
            acaoCancelarCadastro();
        }
    }
});

//Evento para voltar a tela que estava aberta anteriormente (Login || Cadastro)
const modalCancelamento = document.getElementById("CancelarAgendamento");

modalCancelamento.addEventListener("hidden.bs.modal", () => {
    if (modalAnterior) {
        const modalEl = document.getElementById(modalAnterior);
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
})

//Função para mostrar o modal de cancelamento.
function abrirModalCancelamento() {
    const modalEl = document.getElementById("CancelarAgendamento");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

//Função criada para quando tentar cancelar o Login.
function cancelarLogin() {
    modalAnterior = "AcessarLogin"; //Salva o modal que estava aberto para caso o cliente não queira cancelar volta para a tela de login

    document.querySelector("#CancelarAgendamento .modal-title")
        .textContent = "Deseja cancelar o login?";

    acaoCancelarCadastro = () => {
        window.location.href = "index.html";
    };

    abrirModalCancelamento();
}

//Função criada para quando tentar cancelar o cadastro.
function cancelarCadastro() {
    modalAnterior = "CriarCadastro"; //Salva o modal que estava aberto para caso o cliente desista de cancelar o cadastro, volta para a tela de cadastro.

    document.querySelector("#CancelarAgendamento .modal-title").textContent = "Deseja cancelar o cadastro?";

    acaoCancelarCadastro = () => {
        window.location.href = "index.html";
    };

    abrirModalCancelamento();
}

//Função para cancelar Agendamento.
function cancelarAgendamento() {
    document.querySelector("#CancelarAgendamento .modal-title").textContent = "Deseja cancelar o agendamento?";

    acaoCancelarCadastro = () => {
        window.location.href = "index.html";
    };

    abrirModalCancelamento();
}