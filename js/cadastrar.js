const form = document.getElementById("form-cadastro");
const switchPlaca = document.getElementById("switch-placa");
const cadastroPlaca = document.getElementById("cadastro-placa-do-carro");
const erroPlaca = document.getElementById("erro-placa");

//Regex para formatação do input
const regexAntiga = /^[A-Z]{3}-\d{4}$/;
const regexMercosul = /^[A-Z]{3}\d[A-J]\d{2}$/;

//Validação para alterar o tipo de placa do input, Mercosul (ABC1D23) Padrão (ABC-1234)
switchPlaca.addEventListener("change", () => {
    cadastroPlaca.value = "";
    limparErro();

    if (switchPlaca.checked) {
        cadastroPlaca.placeholder = "ABC1D23";
        cadastroPlaca.maxLength = 7;
    } else {
        cadastroPlaca.placeholder = "ABC-1234";
        cadastroPlaca.maxLength = 8;
    }
});

//Máscara para quando o switch estiver marcado ou não.
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
    limparErro();
});

//Função para mostrar o erro no input
function mostraErro(mensagem) {
    erroPlaca.textContent = mensagem;
    erroPlaca.style.display = "block";
    cadastroPlaca.classList.add("erro");
}

//Função para limpar o erro
function limparErro() {
    erroPlaca.textContent = "";
    erroPlaca.style.display = "none";
    cadastroPlaca.classList.remove("erro");
}

//Validação da placa que foi digitada
function validarPlaca() {
    const valor = cadastroPlaca.value;
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


    limparErro();
    return true;
}


//Bloqueio de envio do formulário ao backend caso tenha alguma informação inválida
form.addEventListener("submit", (e) => {
    if (!validarPlaca()) {
        e.preventDefault(); //Ação que impede o envio do formulário.
    }
})

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