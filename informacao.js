const app = document.getElementById("app");

const systemInfo = {
  nome: "Ilist_RP Beta 2.0",
  versao: "4.0.0",
  compilacao: "22/05/2026",
  plataforma: "Android • Windows • iPhone",
  desenvolvedor: "Teddy Machado",
  tecnologias: "HTML5, CSS3, JavaScript e Ionicons",
  instagram: "https://www.instagram.com/teddy_machado007?igsh=MmtjdTF4ZGlqdjVl"
};

const tabs = [
  {
    small: "BL: 01",
    title: "Informações"
  },
  {
    small: "BL: 02",
    title: "Sobre o sistema"
  },
  {
    small: "BL: 03",
    title: "Desenvolvedor"
  }
];

const detailsData = [
  {
    icon: "calendar-outline",
    label: "Compilação",
    value: systemInfo.compilacao
  },
  {
    icon: "desktop-outline",
    label: "Plataformas",
    value: systemInfo.plataforma
  },
  {
    icon: "person-outline",
    label: "Desenvolvedor",
    value: systemInfo.desenvolvedor
  }
];

app.innerHTML = `
  <main>

    <!-- TOPO -->
    <header class="topbar">

      <button 
        class="back-btn"
        onclick="window.location.href='index.html'"
      >
        <ion-icon name="chevron-back-outline"></ion-icon>
      </button>

      <div class="header-text">
        <span>Ilist_RP</span>
        <h1>Sobre o Sistema</h1>
      </div>

    </header>

    <!-- ABA -->
    <div class="tab-info">

      <span id="tabSmall">
        ${tabs[0].small}
      </span>

      <h2 id="tabTitle">
        ${tabs[0].title}
      </h2>

    </div>

    <!-- PÁGINAS -->
    <div class="pages">

      <!-- PAGINA 1 -->
      <section class="page active">

        <div class="main-icon">
          <ion-icon name="information-outline"></ion-icon>
        </div>

        <h2 class="app-name">
          ${systemInfo.nome}
        </h2>

        <div class="version-box">

          <span>
            Versão ${systemInfo.versao}
          </span>

          <strong>
            Beta
          </strong>

        </div>

        <div id="details"></div>

      </section>

      <!-- PAGINA 2 -->
      <section class="page">

        <h3 class="section-title">

          <ion-icon name="reader-outline"></ion-icon>

          Sobre o sistema

        </h3>

        <p class="about-text">

O site foi criado para facilitar as buscas
dos comandos das animações do GTA V RP.

O objetivo é ajudar os jogadores a encontrarem
comandos de forma rápida, simples e organizada.

        </p>

        <div class="feature-list">

          <div class="feature">

            <ion-icon name="contrast-outline"></ion-icon>

            <div>

              <strong>
                Sistema Claro/Escuro
              </strong>

              <p>
                Alterne entre tema claro e escuro.
              </p>

            </div>

          </div>

          <div class="feature">

            <ion-icon name="search-outline"></ion-icon>

            <div>

              <strong>
                Busca por ID ou Nome
              </strong>

              <p>
                Pesquise rapidamente comandos e animações.
              </p>

            </div>

          </div>

          <div class="feature">

            <ion-icon name="copy-outline"></ion-icon>

            <div>

              <strong>
                Copiar comando automático
              </strong>

              <p>
                Exemplo:
                ao copiar “deitar”
                será colado “/e deitar”.
              </p>

            </div>

          </div>

          <div class="feature">

            <ion-icon name="flash-outline"></ion-icon>

            <div>

              <strong>
                Sistema AT
              </strong>

              <p>
                Abre automaticamente o modal
                com o resultado da pesquisa.
              </p>

            </div>

          </div>

        </div>
      </section>

      <!-- PAGINA 3 -->
      <section class="page">

        <h3 class="section-title">

          <ion-icon name="code-slash-outline"></ion-icon>

          Sobre o Desenvolvedor

        </h3>

        <p class="about-text">

Desenvolvido por ${systemInfo.desenvolvedor}.

Tecnologias utilizadas:

${systemInfo.tecnologias}

#EM_BUSCA_DA_MELHORIA 😄

Espero que goste,
deixe sua opinião no Instagram abaixo 👇👇

        </p>

        <div class="instagram-btn">

          <a
            href="${systemInfo.instagram}"
            target="_blank"
          >

            <ion-icon name="logo-instagram"></ion-icon>

            Instagram Oficial

          </a>

        </div>

      </section>

    </div>

    <!-- DOTS -->
    <div class="dots">

      <div class="dot active"></div>
      <div class="dot"></div>
      <div class="dot"></div>

    </div>

  </main>
`;

const details = document.getElementById("details");

detailsData.forEach((item, index) => {

  const row = document.createElement("div");

  row.className = "detail-row";

  row.style.borderBottom =
    index === detailsData.length - 1
      ? "none"
      : "1px solid rgba(255,255,255,.06)";

  row.innerHTML = `

    <div class="detail-icon">

      <ion-icon name="${item.icon}"></ion-icon>

    </div>

    <div class="detail-label">

      ${item.label}

    </div>

    <div class="detail-value">

      ${item.value}

    </div>

  `;

  details.appendChild(row);

});

const pages = document.querySelectorAll(".page");
const dots = document.querySelectorAll(".dot");

const tabSmall = document.getElementById("tabSmall");
const tabTitle = document.getElementById("tabTitle");

let currentPage = 0;
let startX = 0;

function showPage(index){

  pages.forEach(page => {
    page.classList.remove("active");
  });

  dots.forEach(dot => {
    dot.classList.remove("active");
  });

  pages[index].classList.add("active");

  dots[index].classList.add("active");

  tabSmall.textContent = tabs[index].small;

  tabTitle.textContent = tabs[index].title;

}

document.addEventListener("touchstart", event => {

  startX = event.touches[0].clientX;

});

document.addEventListener("touchend", event => {

  const endX = event.changedTouches[0].clientX;

  const diff = startX - endX;

  // esquerda
  if(diff > 50){

    if(currentPage < pages.length - 1){

      currentPage++;

      showPage(currentPage);

    }

  }

  // direita
  if(diff < -50){

    if(currentPage > 0){

      currentPage--;

      showPage(currentPage);

    }

  }

});
