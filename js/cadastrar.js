const form = document.getElementById("form-cadastro");
const switchPlaca = document.getElementById("switch-placa");
const cadastroPlaca = document.getElementById("cadastro-placa-do-carro");
const erroPlaca = document.getElementById("erro-placa");
const senha = document.getElementById("cadastro-senha");
const confirmaSenha = document.getElementById("confirma-senha");
const erroSenha = document.getElementById("erro-senha");
const erroConfSenha = document.getElementById("erro-confirma-senha");
const erroGeral = document.getElementById("erro-geral");
const cpf = document.getElementById("cadastro-cpf");
const erroCpf = document.getElementById("erro-cpf");
const telefone = document.getElementById("cadastro-telefone");
const erroTelefone = document.getElementById("erro-telefone");

function salvarNomeUsuario(nomeCompleto) {
    const primeiroNome = nomeCompleto.trim().split(/\s+/)[0];
    localStorage.setItem("nome", primeiroNome);
}


telefone.addEventListener("input", function () {
    let telefone = this.value.replace(/\D/g, "")

    if (telefone.length > 11)
        telefone = telefone.slice(0, 11);

    if (telefone.length <= 10) {
        telefone = telefone.replace(/^(\d{2})(\d)/g, "($1) $2");
        telefone = telefone.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
        telefone = telefone.replace(/^(\d{2})(\d)/g, "($1) $2");
        telefone = telefone.replace(/(\d{5})(\d)/, "$1-$2");
    }

    this.value = telefone;
});

//Função criada para incluir máscara ao digitar o CPF incluir automáticamente o "." e "-"
cpf.addEventListener("input", function () {
    let cpf = this.value.replace(/\D/g, "")

    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2")
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2")

    this.value = cpf

})

document.addEventListener("DOMContentLoaded", function () {

    //Váriavel para armazenagem de DDDs válidos para cada estado.
    const DDD_VALIDOS = new Set([
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        21, 22, 24, 27, 28,
        31, 32, 33, 34, 35, 37, 38,
        41, 42, 43, 44, 45, 46,
        47, 48, 49,
        51, 53, 54, 55,
        61, 62, 63, 64, 65, 66, 67, 68, 69,
        71, 73, 74, 75, 77, 79,
        81, 82, 83, 84, 85, 86, 87, 88, 89,
        91, 92, 93, 94, 95, 96, 97, 98, 99
    ]);

    function validarTelefone(telefone) {

        telefone = formataTelefone(telefone);

        // IF para verificação do número de telefone se possui 10 ou 11 dígitos
        if (telefone.length !== 10 && telefone.length !== 11)
            return false;

        // IF para validação de números repetidos, EX: (11)99999-9999
        if (/^(\d)\1+$/.test(telefone))
            return false;

        //Váriavel criada para pegar o número DDD do telefone (2 primeiros)
        const ddd = Number(telefone.substring(0, 2));

        // IF para verificação do DDD, busca na váriavel criada anteriormente e analisa se existe.
        if (!DDD_VALIDOS.has(ddd))
            return false;

        //Váriavel criada para pegar o primeiro dígito do telefone e verificar se é 9 (3° número digitado), baseado no padrão ANATEL
        const numero = telefone.substring(2);

        //IF feito para validar o 3° digito do número e verificar se é 9 
        if (telefone.length === 11) {
            if (numero[0] !== "9")
                return false;
        }

        //IF feito para verificar se o número é um telefone fixo (Sem o dígito 9)
        if (telefone.length === 10) {
            if (!/[2-5]/.test(numero[0]))
                return false;
        }

        return true;
    }

    //Função para validação do CPF digitado
    function validarCpf(cpf) {
        var Soma = 0
        var Resto

        var strCPF = String(cpf).replace(/[^\d]/g, '')

        //Validação para estipular tamanho do CPF com 11 digitos
        if (strCPF.length !== 11)
            return false

        //Impede usuário digitar CPF com números repetidos
        if ([
            '00000000000',
            '11111111111',
            '22222222222',
            '33333333333',
            '44444444444',
            '55555555555',
            '66666666666',
            '77777777777',
            '88888888888',
            '99999999999',
        ].indexOf(strCPF) !== -1)
            return false

        //FOR feito para verificar o digito verificador do CPF se é válido
        for (i = 1; i <= 9; i++)
            Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);

        Resto = (Soma * 10) % 11

        //Se o dígito for válido cai nessa verificação 
        if ((Resto == 10) || (Resto == 11))
            Resto = 0

        //Se o dígito NÃO for válido cai nessa verificação
        if (Resto != parseInt(strCPF.substring(9, 10)))
            return false

        Soma = 0

        //Verificação para caso o Dígito passe nas verificações anteriores, Aqui verifica o dígito 11 do CPF
        for (i = 1; i <= 10; i++)
            Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i)

        Resto = (Soma * 10) % 11

        //Mesmas verificações que antes.
        if ((Resto == 10) || (Resto == 11))
            Resto = 0

        if (Resto != parseInt(strCPF.substring(10, 11)))
            return false

        return true
    }

    //Regex para formatação do input
    const regexAntiga = /^[A-Z]{3}-\d{4}$/;
    const regexMercosul = /^[A-Z]{3}\d[A-J]\d{2}$/;
    const regexSenha = /^.{8,}$/; //faz com que a senha tenha no mínimo 8 caracteres

    telefone.addEventListener("blur", () => {
        confereTelefone();
    });

    telefone.addEventListener("focus", () => {
        limparErroTelefone();
    });

    cpf.addEventListener("blur", () => {
        confereCpf();
    });

    cpf.addEventListener("focus", () => {
        limparErroCpf();
    });

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
        limparErroPlaca();
    });

    function mostraErroTelefone(mensagem) {
        erroTelefone.textContent = mensagem;
        erroTelefone.style.display = "block";
        telefone.classList.add("erro");
    }

    function limparErroTelefone() {
        erroTelefone.textContent = "";
        erroTelefone.style.display = "none";
        telefone.classList.remove("erro");
    }

    function mostraErroCpf(mensagem) {
        erroCpf.textContent = mensagem;
        erroCpf.style.display = "block";
        cpf.classList.add("erro");
    }

    function limparErroCpf() {
        erroCpf.textContent = "";
        erroCpf.style.display = "none";
        cpf.classList.remove("erro");
    }

    function confereTelefone() {
        const telefoneDigitado = telefone.value.trim();

        if (!telefoneDigitado) {
            mostraErroTelefone("O telefone é obrigatório!");
            return false;
        }

        if (!validarTelefone(telefoneDigitado)) {
            mostraErroTelefone("Telefone inválido. Verifique e tente novamente.");
            return false;
        }

        limparErroTelefone();
        return true;
    }

    function confereCpf() {
        const cpfDigitado = cpf.value.trim();

        if (!cpfDigitado) {
            mostraErroCpf("O CPF é obrigatório!");
            return false;
        }

        if (!validarCpf(cpfDigitado)) {
            mostraErroCpf("CPF inválido. Verifique e tente novamente.");
            return false;
        }

        limparErroCpf();
        return true;
    }

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
        if (!validarTelefone || !validarCpf || !validarPlaca() || !validarSenha() || !validarConfSenha()) {
            return;
        }

        const telefoneSemFormato = document.getElementById("cadastro-telefone").value.replace(/\D/g, "");
        const cpfSemFormato = document.getElementById("cadastro-cpf").value.replace(/\D/g, "");

        const dados = {
            nome: document.getElementById("cadastro-nome").value,
            dataNascimento: document.getElementById("cadastro-data-nascimento").value,
            telefone: telefoneSemFormato,
            cpf: cpfSemFormato,
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

            if (!response.ok) {
                const texto = await response.text();
                console.error("Erro: ", response.status, texto);
                throw new Error("Erro na requisição");
            }

            const resultado = await response.json();
            salvarNomeUsuario(resultado.nome || dados.nome);
            localStorage.setItem("marcaCarro", dados.marca || "");
            localStorage.setItem("nomeCarro", dados.nomeCarro || "");
            localStorage.setItem("placaCarro", dados.placa || "");
            window.location.href = "index.html"

        } catch (error) {
            erroGeral.textContent = "Erro ao conectar ao servidor!";
            console.error(error);
        }
    });

});