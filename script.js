/* =========================================================
   [INÍCIO] - PROCESSAMENTO DE DADOS E VARIÁVEIS GLOBAIS
   ========================================================= */
const animations = [...new Set(listText.split(',')
    .map(item => item.trim())
    .filter(item => item !== ''))]
    .sort((a, b) => a.localeCompare(undefined, { numeric: true, sensitivity: 'base' }));

let rawItems = listText.split(',').map(n => n.trim()).filter(n => n !== "");
let items = rawItems.map((name, i) => ({ name, id: i + 1 }));
let favorites = JSON.parse(localStorage.getItem('teddyFavs')) || [];
let currentTab = 'all';
let currentItem = null;

// Variável de controle para ativação/desativação do modal automático
let autoOpenModal = JSON.parse(localStorage.getItem('autoOpenModal')) ?? true;
/* =========================================================
   [FIM] - PROCESSAMENTO DE DADOS E VARIÁVEIS GLOBAIS
   ========================================================= */


/* =========================================================
   [INÍCIO] - FUNÇÃO DE RENDERIZAÇÃO (NÚCLEO DO SISTEMA)
   ========================================================= */
function renderItems() {
    const grid = document.getElementById('gridItems');
    const search = document.getElementById('searchInput').value.toLowerCase();
    const sort = document.getElementById('sortOption').value;
    const clearAllBtn = document.getElementById('clearAllBtn');
    let searchTimer
    
    /* SISTEMA DE BUSCA COM ABERTURA AUTOMÁTICA DE MODAL */
    document.getElementById('searchInput').oninput = function() {
        const valorDigitado = this.value.trim();
        
        if (valorDigitado === "") {
            clearTimeout(searchTimer);
            renderItems();
            return;
        }

        clearTimeout(searchTimer);

        searchTimer = setTimeout(() => {
            renderItems();
            
            if (autoOpenModal) {
                const itemEncontrado = items.find(i => i.id.toString() === valorDigitado);
                if (itemEncontrado) {
                    openModal(itemEncontrado.id);
                }
            }
        }, 200); 
    };

    const contador = document.getElementById('totalContador');
    document.getElementById('clearBtn').style.display = search ? 'block' : 'none';
    
    let data = currentTab === 'all' ? [...items] : [...favorites];

    if(search) {
        data = data.filter(i => 
            i.name.toLowerCase().includes(search) ||   
            i.id.toString() === search ||              
            i.id.toString().includes(search)           
        );
    }

    if(sort === 'alpha') {
        data.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        data.sort((a, b) => b.id - a.id);
    }

    if (contador) {
        contador.innerText = data.length;
    }

    clearAllBtn.style.display = (currentTab === 'fav' && favorites.length > 0) ? 'block' : 'none';

    grid.innerHTML = data.map(item => `
        <div class="card" onclick="openModal(${item.id})">
            ${currentTab === 'fav' ? `<i class="fas fa-trash-can delete-fav" onclick="event.stopPropagation(); removeFavorite(${item.id})"></i>` : ''}
            <strong>${item.name}</strong>
            <span>ID: ${item.id}</span>
        </div>
    `).join('');
}
/* =========================================================
   [FIM] - FUNÇÃO DE RENDERIZAÇÃO
   ========================================================= */


/* =========================================================
   [INÍCIO] - ALTERNAR MODAL AUTOMÁTICO E ALERTA CUSTOMIZADO
   ========================================================= */
function toggleAutoModal() {
    const confirmBox = document.createElement('div');
    confirmBox.className = 'custom-alert-overlay';
    confirmBox.id = 'confirmAutoModal';
    
    const acao = autoOpenModal ? 'DESATIVAR' : 'ATIVAR';

    confirmBox.innerHTML = `
        <div class="custom-alert-card">
            <div class="custom-alert-content">
                <span class="custom-alert-title">Sistema</span>
                <span class="custom-alert-text">Quer mesmo <b>${acao}</b> o modal de resultado automático?</span>
            </div>
            <div style="display:flex; gap:10px; margin-top:15px;">
                <button class="custom-alert-btn" style="background:var(--success, #28a745); flex:1;" onclick="executarTrocaModal()">Sim</button>
                <button class="custom-alert-btn" style="background:var(--danger, #dc3545); flex:1;" onclick="document.getElementById('confirmAutoModal').remove()">Não</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmBox);
}

// CORREÇÃO AQUI: Mudado de "ejecutar" para "executar" para bater com o botão acima
function executarTrocaModal() {
    const modalAntigo = document.getElementById('confirmAutoModal');
    if(modalAntigo) modalAntigo.remove();

    autoOpenModal = !autoOpenModal;
    localStorage.setItem('autoOpenModal', autoOpenModal);

    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert-overlay';
    alertBox.id = 'alertAutoModal';
    
    alertBox.innerHTML = `
        <div class="custom-alert-card">
            <div class="custom-alert-content">
                <span class="custom-alert-title">Sistema</span>
                <span class="custom-alert-text">Abertura automática:<br><b>${autoOpenModal ? 'ATIVADA' : 'DESATIVADA'}</b></span>
            </div>
            <button class="custom-alert-btn" onclick="document.getElementById('alertAutoModal').remove()">OK</button>
        </div>
    `;
    
    document.body.appendChild(alertBox);
}
/* =========================================================
   [FIM] - ALTERNAR MODAL AUTOMÁTICO
   ========================================================= */


/* =========================================================
   [INÍCIO] - GERENCIAMENTO DE FAVORITOS E MODAIS
   ========================================================= */
function clearAllFavorites() {
    if(confirm("Deseja limpar todos os favoritos?")) {
        favorites = [];
        localStorage.setItem('teddyFavs', JSON.stringify(favorites));
        renderItems();
    }
}

function removeFavorite(id) {
    favorites = favorites.filter(f => f.id !== id);
    localStorage.setItem('teddyFavs', JSON.stringify(favorites));
    renderItems();
}

function openTextModal(title, body) {
    document.getElementById('textModalTitle').innerText = title;
    document.getElementById('textModalBody').innerText = body;
    document.getElementById('textModal').style.display = 'flex';
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }
function clearSearch() { document.getElementById('searchInput').value = ''; renderItems(); }

function openModal(id) {
    if (document.getElementById('sidebar').classList.contains('active')) return;
    currentItem = items.find(i => i.id === id);
    document.getElementById('modalTitle').innerText = currentItem.name;
    document.getElementById('modalID').innerText = `#${currentItem.id}`;
    document.getElementById('itemModal').style.display = 'flex';
    updateFavBtn();
}

function updateFavBtn() {
    const isFav = favorites.find(f => f.id === currentItem.id);
    const btn = document.getElementById('favBtn');
    btn.innerHTML = isFav ? '<i class="fas fa-star-half-alt"></i> Remover' : '<i class="fas fa-star"></i> Favoritar';
    btn.style.background = isFav ? "var(--danger)" : "var(--primary)";
}

document.getElementById('favBtn').onclick = () => {
    const idx = favorites.findIndex(f => f.id === currentItem.id);
    idx > -1 ? favorites.splice(idx, 1) : favorites.push(currentItem);
    localStorage.setItem('teddyFavs', JSON.stringify(favorites));
    updateFavBtn();
    renderItems();
};
/* =========================================================
   [FIM] - GERENCIAMENTO DE FAVORITOS
   ========================================================= */


/* =========================================================
   [INÍCIO] - UTILITÁRIOS E ESTÉTICA
   ========================================================= */
function switchTab(tab) {
    currentTab = tab;
    document.getElementById('tabAll').classList.toggle('active', tab === 'all');
    document.getElementById('tabFav').classList.toggle('active', tab === 'fav');
    renderItems();
}

function copyCommand() {
    navigator.clipboard.writeText(`/e ${currentItem.name}`);
    const btn = document.querySelector('.btn-copy');
    btn.innerHTML = '<i class="fas fa-check"></i> Pronto!';
    setTimeout(() => btn.innerHTML = '<i class="fas fa-copy"></i> Copiar', 1000);
}

function toggleTheme() { document.body.classList.toggle('light-theme'); }
/* =========================================================
   [FIM] - UTILITÁRIOS E ESTÉTICA
   ========================================================= */


/* =========================================================
   [INÍCIO] - EVENTOS DE JANELA E INSTALAÇÃO (PWA)
   ========================================================= */
window.onclick = (e) => {
    const sidebar = document.getElementById('sidebar');
    if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
    if (sidebar && sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== document.getElementById('menuBtn') && !e.target.closest('.modal-overlay')) {
        toggleSidebar();
    }
}

document.getElementById('searchInput').oninput = renderItems;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(() => console.log("SW registrado!"));
}
/* =========================================================
   [FIM] - EVENTOS DE JANELA E INSTALAÇÃO (PWA)
   ========================================================= */


/* =========================================================
   [INÍCIO] -SRP SEGURANÇA E PROTEÇÃO
   ================================
   falso:false : verdadeiro: true 
   ========================= */
const CONFIG_PROTECAO = {
    bloquearCliqueDireito: false,
    bloquearTeclado: false,
    //seleção com dedo✓
    bloquearSelecao: false,
};

(function() {
    document.addEventListener('contextmenu', (e) => CONFIG_PROTECAO.bloquearCliqueDireito && e.preventDefault());
    document.onselectstart = () => !CONFIG_PROTECAO.bloquearSelecao;
})();

document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) e.preventDefault();
}, { passive: false });
/* =========================================================
   [FIM] - SEGURANÇA E PROTEÇÃO
   ========================================================= */


/* =========================================================
   [INÍCIO] - INICIALIZAÇÃO E ANIMAÇÕES
   ========================================================= */
renderItems();
const contBump = document.getElementById('totalContador');
if(contBump) {
    contBump.classList.remove('bump');
    void contBump.offsetWidth;
    contBump.classList.add('bump');
}
/* =========================================================
   [FIM] - INICIALIZAÇÃO E ANIMAÇÕES
   ========================================================= */


/* =========================================================
   [INÍCIO] - ATUALIZAÇÃO DO SISTEMA (MODAIS EXTRAS)
   ========================================================= */
(function() {
    const startModal = () => {
        const overlay = document.getElementById('un-modal-container');
        const openBtn = document.getElementById('un-btn-trigger');
        const closeBtn = document.getElementById('un-btn-confirm');
        const closeX = document.getElementById('un-close-x');

        if (!overlay || !openBtn) return;
        const open = () => { overlay.style.display = 'flex'; };
        const close = () => { overlay.style.display = 'none'; };
        openBtn.addEventListener('click', open);
        if (closeBtn) closeBtn.addEventListener('click', close);
        if (closeX) closeX.addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    };

    if (document.readyState === 'complete') { startModal(); } 
    else { window.addEventListener('load', startModal); }
})();

const modal = document.getElementById('un-modal-container');
const btnOpen = document.getElementById('un-btn-trigger');
const btnClose = document.getElementById('un-close-x');

if(btnOpen) btnOpen.addEventListener('click', () => { modal.style.display = 'flex'; });
if(btnClose) btnClose.addEventListener('click', () => { modal.style.display = 'none'; });

window.addEventListener('click', (event) => {
    if (event.target === modal) { modal.style.display = 'none'; }
});

document.querySelectorAll('*').forEach(el => {
    el.style.outline = 'none';
    el.style.webkitTapHighlightColor = 'transparent';
});

/* =========================================================
   [INÍCIO] - SISTEMA DE BLOQUEIO DE SCROLL
   ========================================================= */
function gerenciarScrollBody() {
    const elementosBloqueadores = [
        document.querySelector('.sidebar.active'),
        document.querySelector('.modal-open'),
        document.querySelector('#itemModal[style*="flex"]'), 
        document.querySelector('.card-ativo')
    ];

    const deveBloquear = elementosBloqueadores.some(el => el !== null);
    if (deveBloquear) {
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    } else {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }
}

const observerBody = new MutationObserver(() => { gerenciarScrollBody(); });
observerBody.observe(document.body, { attributes: true, subtree: true, childList: true });
gerenciarScrollBody();

/* =========================================================
  novo aqui 
   ========================================================= */
const meuCard = document.getElementById('card-info-versao');
const conteudo = document.getElementById('conteudo-extra');
const btnTexto = document.getElementById('btn-toggle');

meuCard.addEventListener('click', function() {
    // Verifica se o conteúdo está escondido
    if (conteudo.style.display === "none") {
        conteudo.style.display = "block";
        btnTexto.textContent = "FECHAR";
    } else {
        conteudo.style.display = "none";
        btnTexto.textContent = "VER MAIS";
    }
});


/* =========================================================
   [FIM] - SISTEMA DE BLOQUEIO DE SCROLL
   ========================================================= */
