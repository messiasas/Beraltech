// =========================================================
// BERALTECH · scripts
// =========================================================

// Ano automático no rodapé
document.getElementById("ano").textContent = new Date().getFullYear();

// Máscara de telefone: (00) 00000-0000
const telefone = document.getElementById("telefone");
telefone.addEventListener("input", () => {
  let d = telefone.value.replace(/\D/g, "").slice(0, 11);
  if (d.length > 10) d = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  else if (d.length > 6) d = `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  else if (d.length > 2) d = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  else if (d.length) d = `(${d}`;
  telefone.value = d;
});

// Campo de Instagram/Facebook: aceita @usuario, nome da página ou link.
// Ao sair do campo, transforma "@usuario" em link do Instagram
// e completa links sem "https://".
const redeSocial = document.getElementById("rede-social");
redeSocial.addEventListener("blur", () => {
  let v = redeSocial.value.trim();
  if (!v) return;
  if (/^@[\w.]+$/.test(v)) {
    v = `https://www.instagram.com/${v.slice(1)}`;
  } else if (/^(www\.)?(instagram\.com|facebook\.com|fb\.com)\//i.test(v)) {
    v = `https://${v.replace(/^https?:\/\//i, "")}`;
  }
  redeSocial.value = v;
});

// Menu mobile
const navToggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");
const fecharMenu = () => {
  menu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Abrir menu");
};
navToggle.addEventListener("click", () => {
  const aberto = menu.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(aberto));
  navToggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", fecharMenu));
document.addEventListener("keydown", e => { if (e.key === "Escape") fecharMenu(); });
document.addEventListener("click", e => {
  if (!e.target.closest(".nav")) fecharMenu();
});

// Envio do formulário pelo WhatsApp: abre a conversa com os dados já preenchidos
const WHATSAPP = "5511910199419";
const form = document.getElementById("form-contato");
const status = form.querySelector(".form-status");
const camposValidados = [...form.querySelectorAll("[required]"), form.elements.email, telefone];

const mostrarStatus = (texto, tipo = "") => {
  status.textContent = texto;
  status.className = `form-status ${tipo}`.trim();
};

const linkWhatsApp = () => {
  const d = new FormData(form);
  const texto = [
    "Olá, vim pelo site da Beraltech.",
    `Nome: ${d.get("nome")}`,
    d.get("empresa") && `Empresa: ${d.get("empresa")}`,
    d.get("rede_social") && `Instagram/Facebook: ${d.get("rede_social")}`,
    d.get("email") && `E-mail: ${d.get("email")}`,
    d.get("telefone") && `Telefone: ${d.get("telefone")}`,
    `Tipo de projeto: ${d.get("tipo")}`,
    `Mensagem: ${d.get("mensagem")}`
  ].filter(Boolean).join("\n");
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
};

// Campos obrigatórios precisam estar preenchidos; e-mail e telefone, se informados, precisam ser válidos
const validarCampo = campo => {
  let ok = campo.checkValidity() && (!campo.required || campo.value.trim() !== "");
  if (campo === telefone && campo.value) ok = campo.value.replace(/\D/g, "").length >= 10;
  campo.classList.toggle("is-invalid", !ok);
  campo.setAttribute("aria-invalid", String(!ok));
  return ok;
};

form.addEventListener("submit", e => {
  e.preventDefault();
  const invalidos = camposValidados.filter(c => !validarCampo(c));
  if (invalidos.length) {
    mostrarStatus("Preencha seu nome e a descrição do que precisa. Se informar e-mail ou telefone, confira se estão corretos.", "is-error");
    invalidos[0].focus();
    return;
  }
  window.open(linkWhatsApp(), "_blank", "noopener");
  mostrarStatus("Abrimos o WhatsApp com sua mensagem. É só tocar em enviar por lá.", "is-ok");
});

camposValidados.forEach(c => {
  c.addEventListener("input", () => {
    c.classList.remove("is-invalid");
    c.removeAttribute("aria-invalid");
  });
  c.addEventListener("blur", () => { if (c.value) validarCampo(c); });
});

// Botões "Solicitar orçamento" levam o foco direto para o formulário
document.querySelectorAll('a[href="#contato"]').forEach(a =>
  a.addEventListener("click", () =>
    setTimeout(() => form.elements.nome.focus({ preventScroll: true }), 400)
  )
);
