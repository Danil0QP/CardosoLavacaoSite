const form = document.getElementById("form-cadastro");
const switchPlaca = document.getElementById("switch-placa");
const cadastroPlaca = document.getElementById("cadastro-placa-do-carro");
const erroPlaca = document.getElementById("erro-placa");
const senha = document.getElementById("cadastro-senha");
const confirmaSenha = document.getElementById("confirma-senha");
const erroSenha = document.getElementById("erro-senha");
const erroConfSenha = document.getElementById("erro-confirma-senha");
const erroGeral = document.getElementById("erro-geral");

function salvarNomeUsuario(nomeCompleto){
    const primeiroNome = nomeCompleto.trim().split(/\s+/)[0];
    localStorage.setItem("nome", primeiroNome);
}

document.addEventListener("DOMContentLoaded", function () {

    //Regex para formatação do input
    const regexAntiga = /^[A-Z]{3}-\d{4}$/;
    const regexMercosul = /^[A-Z]{3}\d[A-J]\d{2}$/;
    const regexSenha = /^.{8,}$/; //faz com que a senha tenha no mínimo 8 caracteres

    //Validação para alterar o tipo de placa do input, Mercosul (ABC1D23) Padrão (ABC-1234)
    switchPlaca.addEventListener("change", () => {
        cadastroPlaca.value = "";
        limparErroPlaca();

        if (switchPlaca.checked) {
            cadastroPlaca.placeholder = "ABC1D23";
            cadastroPlaca.maxLength = 7;
        } else {
            cadastroPlaca.placeholder = "ABC-1234";
            cadastroPlaca.maxLength = 8;
        }
    });

    // //Máscara para quando o switch estiver marcado ou não.
    cadastroPlaca.addEventListener("input", () => {
        let value = cadastroPlaca.value.toUpperCase().replace(/[^A-Z0-9]/g, "");

        if (!switchPlaca.checked && value.length > 3) {
            value = value.slice(0, 3) + "-" + value.slice(3);
        }

        cadastroPlaca.value = value;
    });

    //Validação da placa ao passar para o próximo campo
    cadastroPlaca.addEventListener("blur", () => {
        validarPlaca();
    });

    //Tira a mensagem de erro ao entrar no campo para digitar a placa
    cadastroPlaca.addEventListener("focus", () => {
        limparErroPlaca();
    });

    //Função para mostrar o erro no input para cadastrar a placa
    function mostraErro(mensagem) {
        erroPlaca.textContent = mensagem;
        erroPlaca.style.display = "block";
        cadastroPlaca.classList.add("erro");
    }

    //Função para limpar o erro
    function limparErroPlaca() {
        erroPlaca.textContent = "";
        erroPlaca.style.display = "none";
        cadastroPlaca.classList.remove("erro");
    }

    //Validação da placa que foi digitada
    function validarPlaca() {
        const valor = cadastroPlaca.value.trim();
        if (!valor) {
            mostraErro("A placa é obrigatória!");
            return false;
        }
        if (switchPlaca.checked) {
            if (!regexMercosul.test(valor)) {
                mostraErro("Formato de placa inválido. Use: ABC1D23");
                return false;
            }
        } else {
            if (!regexAntiga.test(valor)) {
                mostraErro("Formato de placa inválido. Use: ABC-1234");
                return false;
            }
        }
        limparErroPlaca();
        return true;
    }

    //Função para chamar a lógica do input ao inicializar a página
    function inicializar() {
        if (switchPlaca.checked) {
            cadastroPlaca.placeholder = "ABC1D23";
            cadastroPlaca.maxLength = 7;
        } else {
            cadastroPlaca.placeholder = "ABC-1234";
            cadastroPlaca.maxLength = 8;
        }
    }

    inicializar();

    //Função para mostrar erro ao digitar a senha menor que 8 caracteres
    function mostraErroSenha(mensagem) {
        erroSenha.textContent = mensagem;
        erroSenha.style.display = "block";
        senha.classList.add("erro");
    }

    //Função para mostrar erro ao digitar uma senha de confirmação diferente da digitada anteriormente
    function mostraErroConfSenha(mensagem) {
        erroConfSenha.textContent = mensagem;
        erroConfSenha.style.display = "block";
        confirmaSenha.classList.add("erro");
    }

    //Função para limpar erro da senha.
    function limparErroSenha() {
        erroSenha.textContent = "";
        erroSenha.style.display = "none";
        senha.classList.remove("erro");
    }

    //Função para limpar erro da confirmação de senha
    function limparErroConfSenha() {
        erroConfSenha.textContent = "";
        erroConfSenha.style.display = "none";
        confirmaSenha.classList.remove("erro");
    }


    //Validação para que a senha tenha no mínimo 8 caracteres
    senha.addEventListener("input", function () {
        if (senha.value !== confirmaSenha.value) {
            mostraErroConfSenha("As senhas não são iguais!")
        } else {
            limparErroConfSenha();
        }
        if (!regexSenha.test(senha.value)) {
            mostraErroSenha("A senha deve ter no mínimo 8 caracteres!");
        } else {
            limparErroSenha();
        }
    })

    //Validação para a criação e confirmação da senha
    confirmaSenha.addEventListener("input", function () {
        if (senha.value !== confirmaSenha.value) {
            mostraErroConfSenha("As senhas não são iguais!");
        } else {
            limparErroConfSenha();
        }
    })

    function validarSenha() {
        const valor = senha.value;
        if (!valor) {
            mostraErroSenha("A senha é obrigatória!");
            return false;
        } else {
            if (!regexSenha.test(valor)) {
                mostraErroSenha("A senha deve ter no mínimo 8 caracteres!");
                return false;
            }
        }
        limparErroSenha();
        return true;
    }

    function validarConfSenha() {
        const valor = confirmaSenha.value;
        if (!valor) {
            mostraErroConfSenha("A confirmação da senha é obrigatória!");
            return false;
        } else {
            if (senha.value !== valor) {
                mostraErroConfSenha("A senha de confirmação está diferente da senha digitada!");
                return false;
            }
        }
        limparErroConfSenha();
        return true;
    }

    //Bloqueio e envio do formulário para o backend
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        //Bloqueia o envio do formulário caso falte alguma informação.
        if (!validarPlaca() || !validarSenha() || !validarConfSenha()) {
            return;
        }

        const dados = {
            nome: document.getElementById("cadastro-nome").value,
            dataNascimento: document.getElementById("cadastro-data-nascimento").value,
            telefone: document.getElementById("cadastro-telefone").value,
            cpf: document.getElementById("cadastro-cpf").value,
            marca: document.getElementById("cadastro-marca-carro").value,
            nomeCarro: document.getElementById("cadastro-nome-carro").value,
            mercosul: document.getElementById("switch-placa").checked,
            placa: document.getElementById("cadastro-placa-do-carro").value,
            senha: document.getElementById("cadastro-senha").value,
            confSenha: document.getElementById("confirma-senha").value
        };

        try {
            const response = await fetch("http://localhost:8080/cliente/criar-cliente", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            if (!response.ok){
                const texto = await response.text();
                console.error("Erro: ", response.status, texto);
                throw new Error("Erro na requisição");
            }

            const resultado = await response.json();
            salvarNomeUsuario(resultado.nome || dados.nome);
            window.location.href = "index.html"
            
        } catch (error) {
            erroGeral.textContent = "Erro ao conectar ao servidor!";
            console.error(error);
        }
    });

});