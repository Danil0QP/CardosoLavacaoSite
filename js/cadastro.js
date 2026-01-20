let mercosulAtivo = false;

const mapaMercosul = {
  "0": "A",
  "1": "B",
  "2": "C",
  "3": "D",
  "4": "E",
  "5": "F",
  "6": "G",
  "7": "H",
  "8": "I",
  "9": "J"
};

document.addEventListener("change", function (e) {
  if (e.target.id === "switchMercosul") {
    mercosulAtivo = e.target.checked;

    const placa = document.getElementById("placa-carro");
    if (placa) {
      placa.value = "";
      placa.placeholder = mercosulAtivo ? "ABC1C34" : "ABC-1234";
    }
  }
});

document.addEventListener("input", function (e) {
  if (e.target.id !== "placa-carro") return;

  let valor = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");

  if (mercosulAtivo) {
    // Esperado: ABC1234
    if (valor.length >= 7) {
      const letras = valor.substring(0, 3);
      const n1 = valor.substring(3, 4);
      const n2 = valor.substring(4, 5);
      const n3 = valor.substring(5, 7);

      const letraConvertida = mapaMercosul[n2] || n2;

      valor = letras + n1 + letraConvertida + n3;
    }
  } else {
    // Formato antigo ABC-1234
    valor = valor.replace(/^([A-Z]{3})(\d{0,4}).*/, "$1-$2");
  }

  e.target.value = valor;
});
