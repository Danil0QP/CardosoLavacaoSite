function loginSucesso (nomeCompleto){
    //Pega apenas o primeiro nome do cliente
    const primeiroNome = nomeCompleto.split(" ")[0];

    //Salva o nome no navegador, (Brevemente irá ser atualizado para utilização de cookies)
    localStorage.setItem("nome", primeiroNome);
    
    atualizarHeader();
}

function atualizarHeader(){
    const nome = localStorage.getItem("nome");
    const areaUsuario = document.getElementById("area-usuario");

    if(!areaUsuario){
        return;
    }

    if (nome){
        areaUsuario.innerHTML = `<span class="nome-usuario"> Olá, ${nome}</span>`;
    }
}

function logout() {
    localStorage.removeItem("nome");
    location.reload();
}

fetch("components/header.html")
.then(response => response.text())
.then(data => {
    document.getElementById("header").innerHTML = data;
    atualizarHeader();
})
.catch(error => console.error("Erro ao carregar header:", error));
