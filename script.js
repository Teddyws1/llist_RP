const animations = [...new Set(listText.split(',')
    .map(item => item.trim())
    .filter(item => item !== ''))]
    .sort((a, b) => a.localeCompare(undefined, { numeric: true, sensitivity: 'base' }));

let rawItems = listText.split(',').map(n => n.trim()).filter(n => n !== "");
let items = rawItems.map((name, i) => ({ name, id: i + 1 }));
let favorites = JSON.parse(localStorage.getItem('teddyFavs')) || [];
let currentTab = 'all';
let currentItem = null;
let autoOpenModal = JSON.parse(localStorage.getItem('autoOpenModal')) ?? true;

let searchTimer;
let clearSearchTimer;

/* FECHA TECLADO MOBILE */
function fecharTecladoMobile() {
    const ativo = document.activeElement;

    if (ativo && typeof ativo.blur === 'function') {
        ativo.blur();
    }

    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.blur();
        searchInput.readOnly = true;

        setTimeout(() => {
            searchInput.readOnly = false;
        }, 80);
    }
}

/* ABRE MODAL AUTOMÁTICO E FECHA TECLADO */
function abrirModalAutomaticoMobile(id) {
    fecharTecladoMobile();

    requestAnimationFrame(() => {
        openModal(id);
    });
}

function verificarNovo(nome) {
    const nomeLimpo = nome.toLowerCase().trim();

    return comandosNovos.some(cmd =>
        nomeLimpo.startsWith(cmd.toLowerCase().trim())
    );
}

function renderItems() {
    const grid = document.getElementById('gridItems');
    const searchInput = document.getElementById('searchInput');
    const sortOption = document.getElementById('sortOption');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const contador = document.getElementById('totalContador');
    const clearBtn = document.getElementById('clearBtn');

    if (!grid || !searchInput) return;

    const search = searchInput.value.toLowerCase().trim();
    const sort = sortOption ? sortOption.value : 'recent';

    if (clearBtn) {
        clearBtn.style.display = search ? 'block' : 'none';
    }

    let data = currentTab === 'fav' ? [...favorites] : [...items];

    if (search) {
        const isOnlyNumber = /^\d+$/.test(search);

        if (search === "novo") {
            data = data.filter(i => verificarNovo(i.name));
        } else if (isOnlyNumber) {
            data = data.filter(i => i.id.toString() === search);
        } else {
            let searchPattern = search;

            if (search.startsWith('/e ')) {
                searchPattern = search.substring(3).trim();
            } else if (search.startsWith('e')) {
                searchPattern = search.substring(2).trim();
            }

            data = data.filter(i =>
                i.name.toLowerCase().startsWith(searchPattern) ||
                i.id.toString().includes(search)
            );
        }
    }

    switch (sort) {
        case 'alpha':
        case 'alpha-asc':
            data.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
            break;

        case 'alpha-desc':
            data.sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));
            break;

        case 'id-asc':
            data.sort((a, b) => a.id - b.id);
            break;

        case 'id-desc':
        case 'recent':
        default:
            data.sort((a, b) => b.id - a.id);
            break;
    }

    if (contador) {
        contador.innerText = data.length;

        contador.classList.remove('bump');
        requestAnimationFrame(() => {
            contador.classList.add('bump');
        });
    }

    if (clearAllBtn) {
        clearAllBtn.style.display =
            currentTab === 'fav' && favorites.length > 0 ? 'flex' : 'none';
    }

    grid.innerHTML = data.map(item => `
        <div class="card" onclick="openModal(${item.id})">
            ${verificarNovo(item.name) ? `<div class="badge-novo"><ion-icon name="sparkles-outline"></ion-icon></div>` : ""}

            <strong class="item">${item.name}</strong>
            <span>id: ${item.id}</span>
        </div>
    `).join('');
}

function configurarBusca() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const valorDigitado = this.value.trim();
            const itemEncontrado = items.find(i => i.id.toString() === valorDigitado);

            if (itemEncontrado && autoOpenModal) {
                e.preventDefault();
                abrirModalAutomaticoMobile(itemEncontrado.id);
            }
        }
    });

    searchInput.addEventListener('input', function () {
        const valorDigitado = this.value.trim();

        clearTimeout(clearSearchTimer);
        clearTimeout(searchTimer);

        if (valorDigitado === "") {
            renderItems();
            return;
        }

        searchTimer = setTimeout(() => {
            renderItems();

            if (autoOpenModal) {
                const itemEncontrado = items.find(i => i.id.toString() === valorDigitado);

                if (itemEncontrado) {
                    abrirModalAutomaticoMobile(itemEncontrado.id);
                }
            }
        }, 200);

        clearSearchTimer = setTimeout(() => {
            searchInput.value = "";
            renderItems();
        }, 10000);
    });
}

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
                <button class="custom-alert-btn" style="background:var(--success);color: var(--color_aviso_sim); flex:1;" onclick="executarTrocaModal()">Sim</button>
                <button class="custom-alert-btn" style="background:var(--danger); flex:1;
                color: var( --color_aviso);" onclick="document.getElementById('confirmAutoModal').remove()">Não</button>
            </div>
        </div>
    `;

    document.body.appendChild(confirmBox);
}

function executarTrocaModal() {
    const modalAntigo = document.getElementById('confirmAutoModal');
    if (modalAntigo) modalAntigo.remove();

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

function clearAllFavorites() {
    const modal = document.getElementById('confirmModal');

    if (modal) {
        modal.style.display = 'flex';
        bloquearScroll(true);
    } else {
        if (confirm("Deseja limpar todos os favoritos?")) {
            executeClearAll();
        }
    }
}

function executeClearAll() {
    favorites = [];
    localStorage.setItem('teddyFavs', JSON.stringify(favorites));
    renderItems();
    closeModal('confirmModal');
}

function removeFavorite(id) {
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
    fecharTecladoMobile();

    const titleEl = document.getElementById('textModalTitle');
    const bodyEl = document.getElementById('textModalBody');
    const modal = document.getElementById('textModal');

    if (!titleEl || !bodyEl || !modal) return;

    titleEl.innerText = title;
    bodyEl.innerText = body;
    modal.style.display = 'flex';
    bloquearScroll(true);
}

function closeModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.style.display = 'none';
    }

    bloquearScroll(false);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');

    if (!sidebar) return;

    sidebar.classList.toggle('active');
    bloquearScroll(sidebar.classList.contains('active'));
}

function clearSearch() {
    fecharTecladoMobile();

    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.value = '';
    }

    renderItems();
}

function openModal(id) {
    fecharTecladoMobile();

    const sidebar = document.getElementById('sidebar');

    if (sidebar && sidebar.classList.contains('active')) return;

    currentItem = items.find(i => i.id === id);

    if (!currentItem) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalID = document.getElementById('modalID');
    const itemModal = document.getElementById('itemModal');

    if (!modalTitle || !modalID || !itemModal) return;

    modalTitle.innerText = currentItem.name;
    modalID.innerText = `ID: ${currentItem.id}`;
    itemModal.style.display = 'flex';

    bloquearScroll(true);
    updateFavBtn();
}

function updateFavBtn() {
    const btn = document.getElementById('favBtn');

    if (!btn || !currentItem) return;

    const isFav = favorites.find(f => f.id === currentItem.id);

    btn.innerHTML = isFav
        ? '<i class="fas fa-star-half-alt"></i> Remover'
        : '<i class="fas fa-star"></i> Favoritar';

    btn.style.background = isFav ? "var(--danger)" : "var(--primary)";
}

const favBtn = document.getElementById('favBtn');

if (favBtn) {
    favBtn.onclick = () => {
        if (!currentItem) return;

        const idx = favorites.findIndex(f => f.id === currentItem.id);

        if (idx > -1) {
            favorites.splice(idx, 1);
        } else {
            favorites.push(currentItem);
        }

        localStorage.setItem('teddyFavs', JSON.stringify(favorites));

        updateFavBtn();
        renderItems();
    };
}

function criarModalConfirmacao() {
    if (document.getElementById('confirmModal')) return;

    const modalHTML = `
        <div id="confirmModal" class="custom-modal-overlay" style="display:none;">
            <div class="custom-modal-box">
                <div class="custom-modal-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>

                <h3 class="custom-modal-title">Limpar Tudo?</h3>

                <p class="custom-modal-text">
                    Deseja remover todos os favoritos da sua lista?
                </p>

                <div class="custom-modal-buttons">
                    <button class="btn-modal-cancel" onclick="closeModal('confirmModal')">Cancelar</button>
                    <button class="btn-modal-confirm" onclick="executeClearAll()">Sim, limpar</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function switchTab(tab) {
    currentTab = tab;

    const tabAll = document.getElementById('tabAll');
    const tabFav = document.getElementById('tabFav');

    if (tabAll) tabAll.classList.toggle('active', tab === 'all');
    if (tabFav) tabFav.classList.toggle('active', tab === 'fav');

    renderItems();
}

function copyCommand() {
    if (!currentItem) return;

    navigator.clipboard.writeText(`e ${currentItem.name}`);

    const btn = document.querySelector('.btn-copy');

    if (!btn) return;

    btn.innerHTML = '<i class="fas fa-check"></i> Pronto!';

    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
    }, 1000);
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
}

function bloquearScroll(ativo) {
    if (ativo) {
        document.body.classList.add('scroll-lock');
    } else {
        document.body.classList.remove('scroll-lock');
    }
}

window.onclick = (e) => {
    const sidebar = document.getElementById('sidebar');

    if (e.target.classList.contains('modal-overlay')) {
        closeModal(e.target.id);
    }

    if (
        sidebar &&
        sidebar.classList.contains('active') &&
        !sidebar.contains(e.target) &&
        e.target !== document.getElementById('menuBtn') &&
        !e.target.closest('.modal-overlay')
    ) {
        toggleSidebar();
    }
};

function configurarProtecao() {
    if (typeof CONFIG_PROTECAO !== 'undefined') {
        document.addEventListener('contextmenu', (e) => {
            if (CONFIG_PROTECAO.bloquearCliqueDireito) {
                e.preventDefault();
            }
        });

        document.onselectstart = () => !CONFIG_PROTECAO.bloquearSelecao;
    }

    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) e.preventDefault();
    }, { passive: false });

    document.addEventListener('wheel', (e) => {
        if (e.ctrlKey) e.preventDefault();
    }, { passive: false });
}

function iniciarModalAtualizacaoExtra() {
    const overlay = document.getElementById('un-modal-container');
    const openBtn = document.getElementById('un-btn-trigger');
    const closeBtn = document.getElementById('un-btn-confirm');
    const closeX = document.getElementById('un-close-x');

    if (!overlay || !openBtn) return;

    const open = () => {
        fecharTecladoMobile();
        overlay.style.display = 'flex';
        bloquearScroll(true);
    };

    const close = () => {
        overlay.style.display = 'none';
        bloquearScroll(false);
    };

    openBtn.addEventListener('click', open);

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (closeX) closeX.addEventListener('click', close);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
}

function iniciarToggleExtra() {
    const meuCard = document.getElementById('card-info-versao');
    const conteudo = document.getElementById('conteudo-extra');
    const btnTexto = document.getElementById('btn-toggle');

    if (meuCard && conteudo && btnTexto) {
        meuCard.addEventListener('click', function () {
            const fechado = conteudo.style.display === "none";

            conteudo.style.display = fechado ? "block" : "none";
            btnTexto.textContent = fechado ? "FECHAR" : "VER MAIS";
        });
    }
}

function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log("SW registrado!"))
            .catch(() => console.log("Falha ao registrar SW"));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    configurarBusca();
    criarModalConfirmacao();
    configurarProtecao();
    iniciarModalAtualizacaoExtra();
    iniciarToggleExtra();
    renderItems();
    registrarServiceWorker();
});


