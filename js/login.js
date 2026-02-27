function validarCPF(cpf) {
    // Remove tudo que não for número
    cpf = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }

    // Verifica se todos os números são iguais (ex: 11111111111)
    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }

    // Validação para 1° dígito verificador do CPF
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.charAt(9))) {
        return false;
    }

    // Validação feita para 2° digito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.charAt(10))) {
        return false;
    }

    return true;
}

function verificar(){
    
    if (validarCPF(cpf)) {
        console.log("CPF válido");
    } else {
        console.log("CPF inválido");
    }
}

// document.addEventListener("input", function (e) {
//     if (e.target && e.target.id === "cpf") {
//         let value = e.target.value.replace(/\D/g, "");

//         value = value.replace(/(\d{3})(\d)/, "$1.$2");
//         value = value.replace(/(\d{3})(\d)/, "$1.$2");
//         value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

//         e.target.value = value;
//     }
// });

