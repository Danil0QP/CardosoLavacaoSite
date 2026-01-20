//Função para salvar um novo cadastro de cliente!
document.getElementById("salvarCadastro")?.addEventListener("click", salvarCliente);

function salvarCliente() {
    // Aqui vai sua lógica de salvar (fetch, validação, backend etc)
    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf-cadastro").value.trim();
    const numeroTel = document.getElementById("numero-telefone").value.trim();
    const nomeCarro = document.getElementById("nome-carro").value.trim();
    const marcaCarro = document.getElementById("marca-carro").value.trim();
    const placaCarro = document.getElementById("placa-carro").value.trim();
    const senha = document.getElementById("senha-cadastro").value.trim();

    if (!nome || !cpf || !numeroTel || !nomeCarro || !marcaCarro || !placaCarro || !senha) {
        mostrarToast("Preencha todos os campos!");
        return;
    }

    const cliente = {
        nome: nome,
        cpf: cpf,
        numeroTel: numeroTel,
        nomeCarro: nomeCarro,
        marcaCarro: marcaCarro,
        placaCarro: placaCarro,
        senha: senha
    };

    fetch("http://localhost:8080/criar-cliente", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cliente)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao salvar cadastro");
            }
            return response.json();
        })
        .then(data => {
            console.log("Cliente salvo", data);

            mostrarToast("Cadastro salvo com sucesso!");

            document.getElementById("nome").value = "";
            document.getElementById("cpf-cadastro").value = "";
            document.getElementById("numero-telefone").value = "";
            document.getElementById("nome-carro").value = "";
            document.getElementById("marca-carro").value = "";
            document.getElementById("placa-carro").value = "";
            document.getElementById("senha-cadastro").value = "";
        })
        .catch(error => {
            console.error(error);
            mostrarToast("Erro ao salvar cadastro");
        });
}
//Função para salvar Login.
document.getElementById("salvarLogin")?.addEventListener("click", login);

function login() {
    const cpf = document.getElementById("cpf-login").value.trim();
    const senha = document.getElementById("senha-login").value.trim();

    if (!cpf) {
        mostrarToast("Preencha o CPF.");
        return;
    } else if (!senha) {
        mostrarToast("Preencha a SENHA.");
        return;
    }

    mostrarToast("Login realizado com Sucesso!");
}
