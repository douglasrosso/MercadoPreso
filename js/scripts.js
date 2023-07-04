const formularioEndereco = document.querySelector("#formulario-endereco");
const inputCep = document.querySelector("#cep");
const inputEndereco = document.querySelector("#endereco");
const inputCidade = document.querySelector("#cidade");
const inputBairro = document.querySelector("#bairro");
const inputRegiao = document.querySelector("#regiao");
const inputsFormulario = document.querySelectorAll("[data-input]");

const botaoFechar = document.querySelector("#fechar-mensagem");

inputCep.addEventListener("keypress", (e) => {
  const apenasNumeros = /[0-9]|\./;
  const tecla = String.fromCharCode(e.keyCode);

  console.log(tecla);

  console.log(apenasNumeros.test(tecla));

  if (!apenasNumeros.test(tecla)) {
    e.preventDefault();
    return;
  }
});

inputCep.addEventListener("keyup", (e) => {
  const valorInput = e.target.value;

  if (valorInput.length === 8) {
    obterEndereco(valorInput);
  }
});

const obterEndereco = async (cep) => {
  toggleCarregamento();

  inputCep.blur();

  const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

  const resposta = await fetch(apiUrl);

  const dados = await resposta.json();

  console.log(dados);
  console.log(inputsFormulario);
  console.log(dados.erro);

  if (dados.erro === true) {
    if (!inputEndereco.hasAttribute("disabled")) {
      toggleDesabilitado();
    }

    formularioEndereco.reset();
    toggleCarregamento();
    toggleMensagem("CEP Inválido, tente novamente.");
    return;
  }

  if (inputEndereco.value === "") {
    toggleDesabilitado();
  }

  inputEndereco.value = dados.logradouro;
  inputCidade.value = dados.localidade;
  inputBairro.value = dados.bairro;
  inputRegiao.value = dados.uf;

  toggleCarregamento();
};

const toggleDesabilitado = () => {
  if (inputRegiao.hasAttribute("disabled")) {
    inputsFormulario.forEach((input) => {
      input.removeAttribute("disabled");
    });
  } else {
    inputsFormulario.forEach((input) => {
      input.setAttribute("disabled", "disabled");
    });
  }
};

const toggleCarregamento = () => {
  const elementoDesvanecer = document.querySelector("#efeitoFade");
  const elementoCarregador = document.querySelector("#loading");

  elementoDesvanecer.classList.toggle("escondido");
  elementoCarregador.classList.toggle("escondido");
};

const toggleMensagem = (msg) => {
  const elementoDesvanecer = document.querySelector("#efeitoFade");
  const elementoMensagem = document.querySelector("#mensagem");

  const elementoTextoMensagem = document.querySelector("#mensagem p");

  elementoTextoMensagem.innerText = msg;

  elementoDesvanecer.classList.toggle("escondido");
  elementoMensagem.classList.toggle("escondido");
};

botaoFechar.addEventListener("click", () => toggleMensagem());

formularioEndereco.addEventListener("submit", (e) => {
  e.preventDefault();

  toggleCarregamento();

  setTimeout(() => {
    toggleCarregamento();

    toggleMensagem("Endereço salvo com sucesso!");

    formularioEndereco.reset();

    toggleDesabilitado();
  }, 1000);
});
