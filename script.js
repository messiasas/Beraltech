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

// Envio do formulário pelo Formspree sem recarregar a página
const form = document.getElementById("form-contato");
const status = form.querySelector(".form-status");

form.addEventListener("submit", async e => {
  e.preventDefault();

  // Validação dos campos obrigatórios
  let valido = true;
  form.querySelectorAll("[required]").forEach(campo => {
    const ok = campo.checkValidity();
    campo.classList.toggle("is-invalid", !ok);
    if (!ok) valido = false;
  });
  if (!valido) {
    status.textContent = "Preencha nome, um e-mail válido e a descrição do que precisa.";
    form.querySelector(".is-invalid").focus();
    return;
  }

  if (form.action.includes("SEU_ID")) {
    status.textContent = "Formulário ainda não configurado. Fale com a gente pelo WhatsApp.";
    return;
  }

  status.textContent = "Enviando...";
  try {
    const resposta = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    if (!resposta.ok) throw new Error();
    form.reset();
    status.textContent = "Mensagem enviada. Respondemos em até 1 dia útil.";
  } catch {
    status.textContent = "Não foi possível enviar agora. Tente pelo WhatsApp.";
  }
});

form.querySelectorAll("[required]").forEach(c =>
  c.addEventListener("input", () => c.classList.remove("is-invalid"))
);
