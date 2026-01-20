function mostrarToast(mensagem = null) {
    const toastEl = document.getElementById("toastSalvar");

    if (!toastEl) {
        console.error(`Toast com id '${toastSalvar}' não encontrado.`);
        return;
    }

    if (mensagem) {
        const body = toastEl.querySelector('.toast-body');
        if (body) body.textContent = mensagem;
    }

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}