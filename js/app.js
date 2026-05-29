// Lista de cursos
const cursos = [
  { id: 1, titulo: "JavaScript Básico", categoria: "programacao", preco: "R$ 49,90", imagem: "assets/js.png" },
  { id: 2, titulo: "Design UX/UI", categoria: "design", preco: "R$ 79,90", imagem: "assets/design.png" },
  { id: 3, titulo: "Marketing Digital", categoria: "marketing", preco: "R$ 59,90", imagem: "assets/marketing.png" }
];

const container = document.getElementById("cursos-container");
const buttons = document.querySelectorAll("nav button");

// Renderização dos cursos
function renderCursos(lista) {
  container.innerHTML = "";
  lista.forEach(curso => {
    const card = document.createElement("div");
    card.classList.add("curso-card");
    card.innerHTML = `
      <img src="${curso.imagem}" alt="${curso.titulo}">
      <h3>${curso.titulo}</h3>
      <p>${curso.preco}</p>
      <button onclick="favoritar(${curso.id})">Favoritar</button>
      <button onclick="adicionarCarrinho(${curso.id})">Adicionar ao Carrinho</button>
    `;
    container.appendChild(card);
  });
}

// Favoritar cursos
function favoritar(id) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  if (!favoritos.includes(id)) {
    favoritos.push(id);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    alert("Curso favoritado!");
  }
}

// Filtro por categoria
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const filtro = btn.getAttribute("data-filter");
    if (filtro === "all") {
      renderCursos(cursos);
    } else {
      renderCursos(cursos.filter(c => c.categoria === filtro));
    }
  });
});

// Carrinho
let carrinho = [];

function adicionarCarrinho(id) {
  const curso = cursos.find(c => c.id === id);
  carrinho.push(curso);
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById("carrinho-lista");
  const total = document.getElementById("carrinho-total");
  lista.innerHTML = "";
  let soma = 0;

  carrinho.forEach(curso => {
    const li = document.createElement("li");
    li.textContent = `${curso.titulo} - ${curso.preco}`;
    lista.appendChild(li);
    soma += parseFloat(curso.preco.replace("R$ ", "").replace(",", "."));
  });

  total.textContent = `R$ ${soma.toFixed(2)}`;
}

function abrirCarrinho() {
  document.getElementById("carrinho-modal").classList.remove("hidden");
}

function fecharCarrinho() {
  document.getElementById("carrinho-modal").classList.add("hidden");
}

document.getElementById("btn-carrinho").addEventListener("click", abrirCarrinho);

// Dark Mode
const btnDark = document.getElementById("btn-darkmode");
btnDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkmode", document.body.classList.contains("dark"));
});

if (localStorage.getItem("darkmode") === "true") {
  document.body.classList.add("dark");
}

// Login Fake
function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  if (user === "admin" && pass === "123") {
    alert("Login realizado com sucesso!");
    localStorage.setItem("usuario", user);
    document.getElementById("login-modal").classList.add("hidden");
  } else {
    alert("Usuário ou senha inválidos!");
  }
}

document.getElementById("btn-login").addEventListener("click", () => {
  document.getElementById("login-modal").classList.remove("hidden");
});

// Render inicial
renderCursos(cursos);
