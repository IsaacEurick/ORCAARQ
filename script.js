
const formulario = document.querySelector("#form-orcamento");
const mensagem = document.querySelector("#mensagem");
const telefone = document.querySelector("#telefone");

const menuToggle = document.querySelector("#menu-toggle");
const menu = document.querySelector("#menu");

// Atualiza o ano do rodapé
document.querySelector("#ano").textContent =
    new Date().getFullYear();

// Menu para dispositivos móveis
menuToggle.addEventListener("click", () => {
    const aberto = menu.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", aberto);
    menuToggle.setAttribute(
        "aria-label",
        aberto ? "Fechar menu" : "Abrir menu"
    );
});

// Fecha o menu ao selecionar uma seção
menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        menu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
    });
});

// Formatação automática do telefone brasileiro
telefone.addEventListener("input", () => {
    let numeros = telefone.value.replace(/\D/g, "").slice(0, 11);

    if (numeros.length > 10) {
        numeros = numeros.replace(
            /^(\d{2})(\d{5})(\d{0,4})$/,
            "($1) $2-$3"
        );
    } else if (numeros.length > 6) {
        numeros = numeros.replace(
            /^(\d{2})(\d{4})(\d{0,4})$/,
            "($1) $2-$3"
        );
    } else if (numeros.length > 2) {
        numeros = numeros.replace(
            /^(\d{2})(\d+)$/,
            "($1) $2"
        );
    }

    telefone.value = numeros;
});

// Evita inserir conteúdo HTML enviado pelo usuário
function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}

// Envio demonstrativo do formulário
formulario.addEventListener("submit", event => {
    event.preventDefault();

    if (!formulario.reportValidity()) {
        return;
    }

    const dados = Object.fromEntries(
        new FormData(formulario).entries()
    );

    delete dados.consentimento;

    dados.dataEnvio = new Date().toLocaleString("pt-BR");

    let pedidos = [];

    try {
        pedidos = JSON.parse(
            localStorage.getItem("orcaarq_pedidos") || "[]"
        );

        if (!Array.isArray(pedidos)) {
            pedidos = [];
        }
    } catch {
        pedidos = [];
    }

    pedidos.push(dados);

    try {
        localStorage.setItem(
            "orcaarq_pedidos",
            JSON.stringify(pedidos)
        );
    } catch {
        mensagem.textContent =
            "Não foi possível guardar os dados neste navegador. Verifique o armazenamento disponível.";
        mensagem.classList.add("show");
        return;
    }

    mensagem.innerHTML = `
        <strong>Solicitação registrada!</strong><br>
        Obrigado, ${escaparHTML(dados.nome)}.
        Os dados foram armazenados neste navegador
        para fins de demonstração.
    `;

    mensagem.classList.add("show");

    formulario.reset();

    mensagem.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
});
