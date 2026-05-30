

  /* =========================================================
     INÍCIO 02 • DADOS DO SISTEMA
     ========================================================= */

  const systemInfo = {
    nome: "Ilist_RP Beta",
    versao: "4.6.2",

    // ALTERE APENAS ESTAS DUAS DATAS
    ultimaAtualizacao: "30/05/2026 •10:15h",
    //atualiza data de atualização 
    proximaAtualizacao: "",

    plataforma: "Android • iPhone • Windows • macOS • Linux • Web",
    desenvolvedor: "Teddy Machado",
    tecnologias: "HTML5, CSS3, JavaScript e Ionicons",

    instagram: "https://www.instagram.com/teddy_machado007?igsh=MmtjdTF4ZGlqdjVl",
    github: "https://github.com/Teddyws1",
    urlSistema: "https://teddyws1.github.io/llist_RP/"
  };

  /* =========================================================
     FIM 02 • DADOS DO SISTEMA
     ========================================================= */


  /* =========================================================
     INÍCIO 03 • STATUS AUTOMÁTICO
     ========================================================= */

  function normalizarData(valor) {
    if (!valor || typeof valor !== "string") return null;

    const texto = valor.trim();

    if (
      texto === "" ||
      texto.toLowerCase() === "em breve" ||
      texto.toLowerCase() === "em definição"
    ) {
      return null;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
      const dataISO = new Date(`${texto}T00:00:00`);
      return Number.isNaN(dataISO.getTime()) ? null : dataISO;
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
      const [dia, mes, ano] = texto.split("/");
      const dataBR = new Date(`${ano}-${mes}-${dia}T00:00:00`);
      return Number.isNaN(dataBR.getTime()) ? null : dataBR;
    }

    return null;
  }

  function formatarDataBR(valor) {
    const data = normalizarData(valor);

    if (!data) {
      return valor || "Sem previsão";
    }

    return data.toLocaleDateString("pt-BR");
  }

  function calcularDiasRestantes(dataDestino) {
    if (!dataDestino) return null;

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);
    dataDestino.setHours(0, 0, 0, 0);

    const diferencaMs = dataDestino.getTime() - hoje.getTime();

    return Math.ceil(diferencaMs / 86400000);
  }

  function obterStatusAutomatico() {
    const dataProxima = normalizarData(systemInfo.proximaAtualizacao);
    const diasRestantes = calcularDiasRestantes(dataProxima);

    if (diasRestantes !== null) {
      if (diasRestantes > 1) {
        return {
          nome: "Nova versão chegando",
          classe: "status-purple",
          texto: `Faltam ${diasRestantes} dias para a próxima atualização`,
          detalhes: `Próxima atualização prevista: ${formatarDataBR(systemInfo.proximaAtualizacao)}`
        };
      }

      if (diasRestantes === 1) {
        return {
          nome: "Nova versão chegando",
          classe: "status-purple",
          texto: "Falta 1 dia para a próxima atualização",
          detalhes: `Próxima atualização prevista: ${formatarDataBR(systemInfo.proximaAtualizacao)}`
        };
      }

      if (diasRestantes === 0) {  
        return {  
          nome: "Atualizando hoje",  
          classe: "status-warning",  
          texto: "A atualização está prevista para hoje",  
          detalhes: "O sistema pode receber novidades a qualquer momento. Durante atualizações ou manutenções, alguns serviços poderão ficar temporariamente indisponíveis por alguns minutos."  
        };  
      }

      const diasAtrasado = Math.abs(diasRestantes);

      return {
        nome: "Atualização: Em revisão",
        classe: "status-warning",
        texto: diasAtrasado === 1
          ? "A atualização atrasou há 1 dia"
          : `A atualização passou do prazo há ${diasAtrasado} dias`,
        detalhes: `Data prevista era: ${formatarDataBR(systemInfo.proximaAtualizacao)}`
      };
    }

    return {
      nome: "Estável",
      classe: "status-info",
      texto: "Nenhuma atualização prevista no momento.",
      detalhes: "Próxima atualização: Sem previsão"
    };
  }

  const statusSistema = obterStatusAutomatico();

  /* =========================================================
     FIM 03 • STATUS AUTOMÁTICO
     ========================================================= */


  /* =========================================================
     INÍCIO 04 • ABAS DO SISTEMA
     ========================================================= */

  const tabs = [
    {
      small: "etapa: 01",
      title: "Informações"
    },
    {
      small: "etapa: 02",
      title: "Sistemas"
    },
    {
      small: "etapa: 03",
      title: "Desenvolvedor"
    }
  ];

  /* =========================================================
     FIM 04 • ABAS DO SISTEMA
     ========================================================= */


  /* =========================================================
     INÍCIO 05 • DETALHES DA PRIMEIRA ABA
     ========================================================= */

  const detailsData = [
    {
      icon: "reload-outline",
      label: "Última atualização",
      value: formatarDataBR(systemInfo.ultimaAtualizacao)
    },
    {
      icon: "rocket-outline",
      label: "Próxima atualização",
      value: formatarDataBR(systemInfo.proximaAtualizacao)
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

  /* =========================================================
     FIM 05 • DETALHES DA PRIMEIRA ABA
     ========================================================= */


  /* =========================================================
     INÍCIO 06 • RENDERIZAÇÃO DO HTML PRINCIPAL
     ========================================================= */

  app.innerHTML = `
    <main>
      <header class="topbar">
        <button class="back-btn" type="button" aria-label="Voltar para página principal" onclick="window.location.href='index.html'">
          <ion-icon name="chevron-back-outline"></ion-icon>
        </button>

        <div class="header-text">
          <span>Ilist_RP 2026</span>
          <h1>Sobre o Sistema</h1>
        </div>
      </header>

      <div class="tab-info">
        <span id="tabSmall">${tabs[0].small}</span>
        <h2 id="tabTitle">${tabs[0].title}</h2>
      </div>

      <div class="pages">
        <section class="page active">
          <div class="main-icon">
            <ion-icon name="information-outline"></ion-icon>
          </div>

          <h2 class="app-name">${systemInfo.nome}</h2>

          <div class="version-box">
            <span>Versão ${systemInfo.versao}</span>
            <strong>Beta</strong>
          </div>

          <div class="system-status">
            <span class="status-badge ${statusSistema.classe}">
              ${statusSistema.nome}
            </span>

            <p>${statusSistema.texto}</p>

            <small>${statusSistema.detalhes}</small>
          </div>

          <div id="details"></div>
        </section>

        <section class="page">
          <h3 class="section-title">
            <ion-icon name="construct-outline"></ion-icon>
            Sistemas do site
          </h3>

          <p class="about-text">
Aqui estão os principais sistemas disponíveis
no Ilist_RP para melhorar a navegação,
busca e uso dos comandos.
          </p>

          <div class="system-list">
            <div class="system-card">
              <ion-icon name="search-outline"></ion-icon>
              <div>
                <strong>Busca por ID ou nome</strong>
                <p>Permite encontrar comandos rapidamente digitando o ID ou o nome da animação.</p>
              </div>
            </div>

            <div class="system-card">
              <ion-icon name="flash-outline"></ion-icon>
              <div>
                <strong>Sistema AT automático</strong>
                <p>Quando ativado, abre automaticamente o modal do comando encontrado na pesquisa.</p>
                <p>Sistema que fecha o teclado dos celulares automaticamente ao ativar o AT.</p>
              </div>
            </div>

            <div class="system-card">
              <ion-icon name="copy-outline"></ion-icon>
              <div>
                <strong>Copiar comando</strong>
                <p>Copia o comando pronto para usar no RP, facilitando o uso dentro do jogo.</p>
              </div>
            </div>

            <div class="system-card">
              <ion-icon name="bookmark-outline"></ion-icon>
              <div>
                <strong>Favoritos</strong>
                <p>Permite salvar comandos favoritos no navegador para acessar mais rápido.</p>
              </div>
            </div>

            <div class="system-card">
              <ion-icon name="contrast-outline"></ion-icon>
              <div>
                <strong>Tema claro e escuro</strong>
                <p>Alterna o visual do site para melhorar o conforto durante o uso.</p>
              </div>
            </div>

            <div class="system-card">
              <ion-icon name="phone-portrait-outline"></ion-icon>
              <div>
                <strong>Compatível com mobile</strong>
                <p>Interface adaptada para celular, tablet, computador e telas maiores.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="page">
          <h3 class="section-title">
            <ion-icon name="code-slash-outline"></ion-icon>
            Sobre o Desenvolvedor
          </h3>

          <p class="about-text">
Desenvolvido por ${systemInfo.desenvolvedor}.

Tecnologias utilizadas:

${systemInfo.tecnologias}
          </p>

          <div class="instagram-btn">
            <a href="${systemInfo.instagram}" target="_blank" rel="noopener noreferrer">
              <ion-icon name="logo-instagram"></ion-icon>
              Instagram Oficial
            </a>
          </div>

          <div class="github-btn">
            <a href="${systemInfo.github}" target="_blank" rel="noopener noreferrer">
              <ion-icon name="logo-github"></ion-icon>
              Visita no GitHub
            </a>
          </div>

          <div class="share-system-btn">
            <button type="button" id="openShareBtn">
              <ion-icon name="share-social-outline"></ion-icon>
              Compartilhar sistema
            </button>
          </div>
        </section>
      </div>

      <div class="dots">
        <div class="dot active"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>

      <div class="share-modal" id="shareModal">
        <div class="share-modal-content">
          <button type="button" class="close-share" id="closeShareBtn">
            <ion-icon name="close-outline"></ion-icon>
          </button>

          <h3>Compartilhar sistema</h3>

          <p>Escolha onde deseja compartilhar:</p>

          <div class="share-options">
            <a id="shareWhatsapp" target="_blank" rel="noopener noreferrer">
              <ion-icon name="logo-whatsapp"></ion-icon>
              WhatsApp
            </a>

            <a id="shareFacebook" target="_blank" rel="noopener noreferrer">
              <ion-icon name="logo-facebook"></ion-icon>
              Facebook
            </a>

            <a id="shareTelegram" target="_blank" rel="noopener noreferrer">
              <ion-icon name="paper-plane-outline"></ion-icon>
              Telegram
            </a>

            <button type="button" id="copyUrlBtn">
              <ion-icon name="link-outline"></ion-icon>
              Copiar URL
            </button>
          </div>
        </div>
      </div>
    </main>
  `;

  /* =========================================================
     FIM 06 • RENDERIZAÇÃO DO HTML PRINCIPAL
     ========================================================= */


  /* =========================================================
     INÍCIO 07 • SELETORES PRINCIPAIS
     ========================================================= */

  const details = document.getElementById("details");
  const pages = document.querySelectorAll(".page");
  const dots = document.querySelectorAll(".dot");

  const tabSmall = document.getElementById("tabSmall");
  const tabTitle = document.getElementById("tabTitle");

  const shareModal = document.getElementById("shareModal");
  const openShareBtn = document.getElementById("openShareBtn");
  const closeShareBtn = document.getElementById("closeShareBtn");
  const copyUrlBtn = document.getElementById("copyUrlBtn");

  const shareWhatsapp = document.getElementById("shareWhatsapp");
  const shareFacebook = document.getElementById("shareFacebook");
  const shareTelegram = document.getElementById("shareTelegram");

  /* =========================================================
     FIM 07 • SELETORES PRINCIPAIS
     ========================================================= */


  /* =========================================================
     INÍCIO 08 • RENDERIZA DETALHES DINÂMICOS
     ========================================================= */

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

  /* =========================================================
     FIM 08 • RENDERIZA DETALHES DINÂMICOS
     ========================================================= */


  /* =========================================================
     INÍCIO 09 • CONTROLE DAS PÁGINAS
     ========================================================= */

  let currentPage = 0;
  let startX = 0;

  function showPage(index) {
    if (index < 0 || index >= pages.length) {
      return;
    }

    pages.forEach((page, pageIndex) => {
      page.classList.toggle("active", pageIndex === index);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });

    tabSmall.textContent = tabs[index].small;
    tabTitle.textContent = tabs[index].title;

    currentPage = index;
  }

  /* =========================================================
     FIM 09 • CONTROLE DAS PÁGINAS
     ========================================================= */


  /* =========================================================
     INÍCIO 10 • SLIDE TOUCH MOBILE
     ========================================================= */

  document.addEventListener("touchstart", event => {
    startX = event.touches[0].clientX;
  }, { passive: true });

  document.addEventListener("touchend", event => {
    if (shareModal.classList.contains("active")) {
      return;
    }

    const endX = event.changedTouches[0].clientX;
    const diff = startX - endX;
    const minSwipeDistance = 50;

    if (diff > minSwipeDistance) {
      showPage(currentPage + 1);
    }

    if (diff < -minSwipeDistance) {
      showPage(currentPage - 1);
    }
  }, { passive: true });

  /* =========================================================
     FIM 10 • SLIDE TOUCH MOBILE
     ========================================================= */


  /* =========================================================
     INÍCIO 11 • ALERTA CUSTOMIZADO
     ========================================================= */

  function showCopyAlert() {
    const oldAlert = document.getElementById("copyAlert");

    if (oldAlert) {
      oldAlert.remove();
    }

    const alertBox = document.createElement("div");

    alertBox.id = "copyAlert";
    alertBox.className = "copy-alert";

    alertBox.innerHTML = `
      <ion-icon name="checkmark-circle-outline"></ion-icon>
      <span>URL copiada com sucesso!</span>
    `;

    document.body.appendChild(alertBox);

    requestAnimationFrame(() => {
      alertBox.classList.add("show");
    });

    setTimeout(() => {
      alertBox.classList.remove("show");

      setTimeout(() => {
        alertBox.remove();
      }, 250);
    }, 2200);
  }

  /* =========================================================
     FIM 11 • ALERTA CUSTOMIZADO
     ========================================================= */


  /* =========================================================
     INÍCIO 12 • MODAL DE COMPARTILHAMENTO
     ========================================================= */

  function openShareModal() {
    const url = encodeURIComponent(systemInfo.urlSistema);
    const text = encodeURIComponent(`Conheça o ${systemInfo.nome}`);

    shareWhatsapp.href = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    shareTelegram.href = `https://t.me/share/url?url=${url}&text=${text}`;
  
    shareModal.classList.add("active");
    document.body.classList.add("modal-open");
  }

  function closeShareModal() {
    shareModal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  /* =========================================================
     FIM 12 • MODAL DE COMPARTILHAMENTO
     ========================================================= */


  /* =========================================================
     INÍCIO 13 • COPIAR URL DO SISTEMA
     ========================================================= */

  function copyUrlFallback() {
    const input = document.createElement("input");

    input.value = systemInfo.urlSistema;
    input.setAttribute("readonly", "");

    document.body.appendChild(input);

    input.select();
    input.setSelectionRange(0, input.value.length);

    document.execCommand("copy");

    document.body.removeChild(input);

    showCopyAlert();
  }

  function copySystemUrl() {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(systemInfo.urlSistema)
        .then(showCopyAlert)
        .catch(copyUrlFallback);

      return;
    }

    copyUrlFallback();
  }

  /* =========================================================
     FIM 13 • COPIAR URL DO SISTEMA
     ========================================================= */


  /* =========================================================
     INÍCIO 14 • EVENTOS
     ========================================================= */

  openShareBtn.addEventListener("click", openShareModal);
  closeShareBtn.addEventListener("click", closeShareModal);
  copyUrlBtn.addEventListener("click", copySystemUrl);

  shareModal.addEventListener("click", event => {
    if (event.target === shareModal) {
      closeShareModal();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && shareModal.classList.contains("active")) {
      closeShareModal();
    }
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showPage(index);
    });
  });
/* =========================================================
   INÍCIO 00 • INICIALIZAÇÃO DO ARQUIVO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     INÍCIO 00.1 • PROTEÇÃO DA INTERFACE
     Bloqueia copiar, selecionar, botão direito, arrastar e zoom
     ========================================================= */

  const metaViewport = document.querySelector("meta[name='viewport']") || document.createElement("meta");

  metaViewport.name = "viewport";
  metaViewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";

  if (!document.querySelector("meta[name='viewport']")) {
    document.head.appendChild(metaViewport);
  }

  const protectionStyle = document.createElement("style");

  protectionStyle.innerHTML = `
    html,
    body,
    *{
      -webkit-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select:none;

      -webkit-touch-callout:none;
      -webkit-tap-highlight-color:transparent;
    }

    img,
    ion-icon,
    a,
    button{
      -webkit-user-drag:none;
      user-drag:none;
    }

    input,
    textarea,
    [contenteditable="true"]{
      -webkit-user-select:text;
      -moz-user-select:text;
      -ms-user-select:text;
      user-select:text;
    }
  `;

  document.head.appendChild(protectionStyle);

  const isEditableElement = element => {
    return (
      element &&
      (
        element.tagName === "INPUT" ||
        element.tagName === "TEXTAREA" ||
        element.isContentEditable
      )
    );
  };

  document.addEventListener("contextmenu", event => {
    event.preventDefault();
  });

  document.addEventListener("selectstart", event => {
    if (!isEditableElement(event.target)) {
      event.preventDefault();
    }
  });

  document.addEventListener("dragstart", event => {
    event.preventDefault();
  });

  document.addEventListener("copy", event => {
    if (!event.target.closest("#copyUrlBtn")) {
      event.preventDefault();
    }
  });

  document.addEventListener("cut", event => {
    if (!isEditableElement(event.target)) {
      event.preventDefault();
    }
  });

  document.addEventListener("paste", event => {
    if (!isEditableElement(event.target)) {
      event.preventDefault();
    }
  });

  document.addEventListener("keydown", event => {
    const tecla = event.key.toLowerCase();

    if (
      event.ctrlKey &&
      (
        tecla === "c" ||
        tecla === "x" ||
        tecla === "a" ||
        tecla === "s" ||
        tecla === "u" ||
        tecla === "p" ||
        tecla === "+" ||
        tecla === "-" ||
        tecla === "=" ||
        tecla === "0"
      )
    ) {
      event.preventDefault();
    }

    if (
      event.key === "F12" ||
      (
        event.ctrlKey &&
        event.shiftKey &&
        (
          tecla === "i" ||
          tecla === "j" ||
          tecla === "c"
        )
      )
    ) {
      event.preventDefault();
    }
  });

  document.addEventListener("wheel", event => {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }, { passive:false });

  document.addEventListener("gesturestart", event => {
    event.preventDefault();
  });

  document.addEventListener("gesturechange", event => {
    event.preventDefault();
  });

  document.addEventListener("gestureend", event => {
    event.preventDefault();
  });

  document.addEventListener("touchmove", event => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, { passive:false });

  let lastTouchEnd = 0;

  document.addEventListener("touchend", event => {
    const now = Date.now();

    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }

    lastTouchEnd = now;
  }, { passive:false });

  /* =========================================================
     FIM 00.1 • PROTEÇÃO DA INTERFACE
     ========================================================= */


  /* =========================================================
     INÍCIO 01 • VERIFICAÇÃO INICIAL
     ========================================================= */

  const app = document.getElementById("app");

  if (!app) {
    alert("Erro: não existe uma div com id app no HTML.");
    return;
  }

  /* =========================================================
     FIM 01 • VERIFICAÇÃO INICIAL
     ========================================================= */


});

/* =========================================================
   FIM 00 • INICIALIZAÇÃO DO ARQUIVO
   ========================================================= */
