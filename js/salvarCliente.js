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

            const modalEl = document.getElementById("CriarCadastro");
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.hide();

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
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

//Função para validação da senha, se a confirmação != Senha aparece a mensagem.
function validarSenha() {
    const senha = document.getElementById("senha-cadastro").value;
    const confirmaSenha = document.getElementById("confirmar-senha").value;
    const erro = document.getElementById("erroSenha");

    if(senha !== confirmaSenha) {
        erro.textContent = "As senhas não conferem!";
        return false;
    }

    erro.textContent = "";
    salvarCliente();
}
