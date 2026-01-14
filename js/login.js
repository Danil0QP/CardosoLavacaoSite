document.addEventListener("input", function (e) {
    if (e.target && e.target.id === "cpf") {
        let value = e.target.value.replace(/\D/g, "");

        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        e.target.value = value;
    }
});

