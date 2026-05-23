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
let searchTimer; // Mantido fora para evitar bugs no temporizador de digitação
let clearSearchTimer; // APRIMORAMENTO: Controla o timer fixo de inatividade (10 segundos)

function renderItems() {
    const grid = document.getElementById('gridItems');
    const searchInput = document.getElementById('searchInput'); // Captura a referência do elemento
    const search = searchInput.value.toLowerCase();
    const sort = document.getElementById('sortOption').value;
    const clearAllBtn = document.getElementById('clearAllBtn');
    
    /* SISTEMA DE BUSCA COM ABERTURA AUTOMÁTICA DE MODAL */
    document.getElementById('searchInput').oninput = function() {
        const valorDigitado = this.value.trim();
        
        // APRIMORAMENTO: Zera o cronômetro de 10s sempre que o usuário digitar uma nova letra
        clearTimeout(clearSearchTimer);

        if (valorDigitado === "") {
            clearTimeout(searchTimer);
            renderItems();
            return;
        }

        clearTimeout(searchTimer);

        searchTimer = setTimeout(() => {
            renderItems();
            
            if (typeof autoOpenModal !== 'undefined' && autoOpenModal) {
                const itemEncontrado = items.find(i => i.id.toString() === valorDigitado);
                if (itemEncontrado) {
                    openModal(itemEncontrado.id);
                }
            }
        }, 200); 

        // APRIMORAMENTO: Agenda a limpeza automática e obrigatória após 10 segundos parado
        clearSearchTimer = setTimeout(() => {
            searchInput.value = "";
            renderItems();
        }, 10000); // 10000ms = 10 segundos
    };

    const contador = document.getElementById('totalContador');
    document.getElementById('clearBtn').style.display = search ? 'block' : 'none';
    
    let data = typeof currentTab !== 'undefined' && currentTab === 'fav' ? [...favorites] : [...items];

    if(search) {
        // NOVO SISTEMA: Se a pesquisa for apenas números, filtra o ID exato
        const isOnlyNumber = /^\d+$/.test(search); 
        
        if (isOnlyNumber) {
            data = data.filter(i => i.id.toString() === search);
        } else {
            // Tratamento do comando /e se o usuário utilizar
            let searchPattern = search;
            if (search.startsWith('/e ')) {
                searchPattern = search.substring(3).trim();
            } else if (search.startsWith('/e')) {
                searchPattern = search.substring(2).trim();
            }

            // Filtra trazendo APENAS os itens cujos nomes começam com o termo pesquisado
            data = data.filter(i => 
                i.name.toLowerCase().startsWith(searchPattern) ||   
                i.id.toString().includes(search)           
            );
        }
    }

    if(sort === 'alpha') {
        data.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        data.sort((a, b) => b.id - a.id);
    }

    if (contador) {
        contador.innerText = data.length;
    }

    if (clearAllBtn) {
        clearAllBtn.style.display = (typeof currentTab !== 'undefined' && currentTab === 'fav' && favorites.length > 0) ? 'block' : 'none';
    }

    // Renderiza os cards exibindo o NOME COMPLETO normalmente (Sem cards extras de controle)
    grid.innerHTML = data.map(item => `
        <div class="card" onclick="openModal(${item.id})">
            <strong class="item">${item.name}</strong>
            <span>id: ${item.id}</span>
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
/* --- SEU JS ORIGINAL APRIMORADO --- */

function clearAllFavorites() {
    // Aprimorado para abrir o modal estilizado em vez do confirm() nativo
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        // Fallback caso o modal não tenha sido carregado
        if(confirm("Deseja limpar todos os favoritos?")) {
            executeClearAll();
        }
    }
}

// Função auxiliar para executar a limpeza (usada pelo botão "Sim" do modal)
function executeClearAll() {
    favorites = [];
    localStorage.setItem('teddyFavs', JSON.stringify(favorites));
    renderItems();
    closeModal('confirmModal');
}

function removeFavorite(id) {
    // Aprimorado com animação antes de remover
    const element = document.querySelector(`[data-id="${id}"]`);
    if (element) {
        element.classList.add('item-exit-active');
    }

    setTimeout(() => {
        favorites = favorites.filter(f => f.id !== id);
        localStorage.setItem('teddyFavs', JSON.stringify(favorites));
        renderItems();
    }, 300);
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
    document.getElementById('modalID').innerText = `ID: ${currentItem.id}`;
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

/* --- INJEÇÃO AUTOMÁTICA DO MODAL DE AVISO --- */
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('confirmModal')) {
            const modalHTML = `
                <div id="confirmModal" class="custom-modal-overlay" style="display:none;">
                    <div class="custom-modal-box">
                        <div class="custom-modal-icon"><i class="fas fa-exclamation-triangle"></i></div>
                        <h3 class="custom-modal-title">Limpar Tudo?</h3>
                        <p class="custom-modal-text">Deseja remover todos os favoritos da sua lista?</p>
                        <div class="custom-modal-buttons">
                            <button class="btn-modal-cancel" onclick="closeModal('confirmModal')">Cancelar</button>
                            <button class="btn-modal-confirm" onclick="executeClearAll()">Sim, limpar</button>
                        </div>
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    });
})();

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
    navigator.clipboard.writeText(`e ${currentItem.name}`);
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

if (contBump) {
    
    contBump.classList.remove('bump');
    
    requestAnimationFrame(() => {
        
        contBump.classList.add('bump');
        
    });
    
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

const cards = document.querySelectorAll('.card');

if (cards.length > 0) {
    
    cards.forEach(card => {
        
        card.addEventListener('click', () => {
            
            console.log('clicou');
            
        });
        
    });
    
}
/* =========================================================
   [FIM] - SISTEMA DE BLOQUEIO DE SCROLL
   ========================================================= */
