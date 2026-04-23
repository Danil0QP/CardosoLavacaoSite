const inputCpf = document.getElementById("login-cpf");
const inputSenha = document.getElementById("login-senha");
const botaoAcesso = document.getElementById("botao-acesso");
const erroLogin = document.getElementById("erro-login");

document.addEventListener("DOMContentLoaded", function () {

    // Função para estilizar o CPF
    function normalizaCpf(valor) {
        return valor.replace(/\D/g, "");
    }

    // Função para mostrar mensagem de erro
    function mostraErroLogin(mensagem) {
        erroLogin.textContent = mensagem;
        erroLogin.style.display = "block";
    }

    function limpaErroLogin() {
        erroLogin.textContent = "";
        erroLogin.style.display = "none";
    }

    // Função para salvar o login
    function salvarSessao(usuario) {
        const nomeCompleto = (usuario.nome || "").trim();
        // Verificação para pegar o nome completo e salvar apenas o primeiro nome do cliente
        const primeiroNome = nomeCompleto ? nomeCompleto.split(/\s+/)[0] : "";

        // Verificações para armazenagem dos dados no local storage
        if (primeiroNome) {
            localStorage.setItem("nome", primeiroNome);
        }
        if (usuario.id) {
            localStorage.setItem("clienteId", usuario.id);
        }
        if (usuario.tipoUsuario) {
            localStorage.setItem("tipoUsuario", usuario.tipoUsuario);
        }

        const marcaCarro = usuario.marca || usuario.marcaCarro || "";
        const nomeCarro = usuario.nomeCarro || usuario.carro || "";
        const placaCarro = usuario.placa || usuario.placaCarro || "";

        if (marcaCarro) {
            localStorage.setItem("marcaCarro", marcaCarro);
        }

        if (nomeCarro) {
            localStorage.setItem("nomeCarro", nomeCarro);
        }

        if (placaCarro) {
            localStorage.setItem("placaCarro", placaCarro);
        }
    }

    async function autenticar(endpoint, payload) {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            return null;
        }

        return response.json();
    }

    async function validar() {
        const cpf = normalizaCpf(inputCpf.value.trim());
        const senha = inputSenha.value;

        if (!cpf || !senha) {
            mostraErroLogin("Informe o CPF e Senha para continuar com o login!");
            return;
        }

        limpaErroLogin();

        const payload = { cpf, senha };
        const endpoints = [
            "http://localhost:8080/auth/login",
            "http://localhost:8080/login",
            "https://cardosolavacao.rf.gd/auth/login",
            "https://cardosolavacao.rf.gd/login"
        ];

        let usuario = null;

        for (const endpoint of endpoints) {
            try {
                usuario = await autenticar(endpoint, payload);
                if (usuario) {
                    break;
                }
            } catch (error) {
                console.error(`Falha ao autenticar em ${endpoint}:`, error);
            }
        }

        if (!usuario) {
            mostraErroLogin("CPF ou Senha inválidos.");
            return;
        }

        salvarSessao(usuario);
        window.location.href = "index.html";
    }

    botaoAcesso.addEventListener("click", validar);
    inputSenha.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            validar();
        }
    });
});