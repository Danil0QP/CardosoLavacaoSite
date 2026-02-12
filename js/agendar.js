let agendamentos = [];

function adicionarAgendamento(){
    const data = document.getElementById("data").value;
    const hora = document.getElementById("hora").value;

    if(!data || !hora) {
        alert("Preencha todos os campos");
        return;
    }

    const jaExiste = agendamentos.some(a => a.data === data && a.hora === hora);
    if (jaExiste){
        alert("Já existe um agendamento para esse horário.");
        return;
    }

    agendamentos.push({
        data,
        hora
    });

    atualizarTabela();
}