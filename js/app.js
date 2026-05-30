const cursos = [
  { id: 1, titulo: "JavaScript Básico", categoria: "programacao", preco: 49.90, imagem: "assets/js.png" },
  { id: 2, titulo: "Design UX/UI", categoria: "design", preco: 79.90, imagem: "assets/design.png" },
  { id: 3, titulo: "Marketing Digital", categoria: "marketing", preco: 59.90, imagem: "assets/marketing.png" }
];

// Preço agora é número — evita o problema de parsing manual de string

const container = document.getElementById("cursos-container");
const overlay = document.getElementById("modal-overlay");

// ── Toast ──────────────────────────────────────────────────────────────
function mostrarToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("visivel");
  setTimeout(() => toast.classList.remove("visivel"), 2500);
}

// ── Renderização ───────────────────────────────────────────────────────
function renderCursos(lista) {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = "<p style='padding:1rem'>Nenhum curso encontrado.</p>";
    return;
  }

  lista.forEach(curso => {
    const card = document.createElement("div");
    card.classList.add("curso-card");

    const jaFavoritado = favoritos.includes(curso.id);
    const btnFavoritar = document.createElement("button");
    btnFavoritar.textContent = jaFavoritado ? "⭐ Favoritado" : "Favoritar";
    if (jaFavoritado) btnFavoritar.classList.add("favoritado");
    btnFavoritar.addEventListener("click", () => favoritar(curso.id, btnFavoritar));

    const btnCarrinho = document.createElement("button");
    btnCarrinho.textContent = "Adicionar ao Carrinho";
    btnCarrinho.addEventListener("click", () => adicionarCarrinho(curso.id));

    // Usando textContent para evitar XSS
    const img = document.createElement("img");
    img.src = curso.imagem;
    img.alt = curso.titulo;

    const titulo = document.createElement("h3");
    titulo.textContent = curso.titulo;

    const preco = document.createElement("p");
    preco.textContent = `R$ ${curso.preco.toFixed(2).replace(".", ",")}`;

    card.append(img, titulo, preco, btnFavoritar, btnCarrinho);
    container.appendChild(card);
  });
}

// ── Favoritar ──────────────────────────────────────────────────────────
function favoritar(id, botao) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  if (!favoritos.includes(id)) {
    favoritos.push(id);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    botao.textContent = "⭐ Favoritado";
    botao.classList.add("favoritado");
    mostrarToast("Curso adicionado aos favoritos!");
  } else {
    mostrarToast("Este curso já está nos favoritos.");
  }
}

// ── Filtros ────────────────────────────────────────────────────────────
const navButtons = document.querySelectorAll("nav button");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("ativo"));
    btn.classList.add("ativo");

    const filtro = btn.getAttribute("data-filter");
    const lista = filtro === "all" ? cursos : cursos.filter(c => c.categoria === filtro);
    renderCursos(lista);
  });
});

// ── Carrinho ───────────────────────────────────────────────────────────
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function adicionarCarrinho(id) {
  if (carrinho.find(c => c.id === id)) {
    mostrarToast("Este curso já está no carrinho.");
    return;
  }
  const curso = cursos.find(c => c.id === id);
  carrinho.push(curso);
  salvarCarrinho();
  atualizarCarrinho();
  mostrarToast(`"${curso.titulo}" adicionado ao carrinho!`);
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(c => c.id !== id);
  salvarCarrinho();
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById("carrinho-lista");
  const totalEl = document.getElementById("carrinho-total");
  const countEl = document.getElementById("carrinho-count");
  lista.innerHTML = "";

  let soma = 0;
  carrinho.forEach(curso => {
    const li = document.createElement("li");

    const nome = document.createElement("span");
    nome.textContent = `${curso.titulo} — R$ ${curso.preco.toFixed(2).replace(".", ",")}`;

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "✕";
    btnRemover.title = "Remover";
    btnRemover.addEventListener("click", () => removerDoCarrinho(curso.id));

    li.append(nome, btnRemover);
    lista.appendChild(li);
    soma += curso.preco;
  });

  totalEl.textContent = `R$ ${soma.toFixed(2).replace(".", ",")}`;
  countEl.textContent = carrinho.length;
}

function abrirModal(modalId) {
  document.getElementById(modalId).classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function fecharTodosModais() {
  document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
  overlay.classList.add("hidden");
}

// Fechar ao clicar no overlay
overlay.addEventListener("click", fecharTodosModais);

document.getElementById("btn-carrinho").addEventListener("click", () => abrirModal("carrinho-modal"));
document.getElementById("btn-fechar-carrinho").addEventListener("click", fecharTodosModais);

// ── Dark Mode ──────────────────────────────────────────────────────────
const btnDark = document.getElementById("btn-darkmode");
btnDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkmode", document.body.classList.contains("dark"));
});

if (localStorage.getItem("darkmode") === "true") {
  document.body.classList.add("dark");
}

// ── Login ──────────────────────────────────────────────────────────────
document.getElementById("btn-login").addEventListener("click", () => abrirModal("login-modal"));
document.getElementById("btn-fechar-login").addEventListener("click", fecharTodosModais);

document.getElementById("btn-entrar").addEventListener("click", () => {
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value;
  const erroEl = document.getElementById("login-erro");

  if (user === "admin" && pass === "123") {
    localStorage.setItem("usuario", user);
    fecharTodosModais();
    mostrarToast(`Bem-vindo, ${user}!`);
    erroEl.textContent = "";
  } else {
    erroEl.textContent = "Usuário ou senha inválidos.";
  }
});

// ── Init ───────────────────────────────────────────────────────────────
atualizarCarrinho();
renderCursos(cursos);