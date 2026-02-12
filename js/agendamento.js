function atualizarTabela() {
    const tbody = document.getElementById("tabela-agendamentos");
    tbody.innerHTML = "";

    agendamentos.forEach(a => {
        tbody.innerHTML += `
        <tr>
            <td>${a.data}</td>
            <td>${a.hora}</td>
        </tr>
        `;
    });

    
}