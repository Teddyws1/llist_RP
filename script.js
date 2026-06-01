/* ============================================================
   INÍCIO • SCRIPT OTIMIZADO
   Mantém as linhas originais e acrescenta melhorias de:
   - acessibilidade
   - desempenho
   - clique mais instantâneo
   - teclado
   - modais
   - cards e botões
   ============================================================ */

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

/* ============================================================
   INÍCIO • HELPERS MODERNOS DE PERFORMANCE E ACESSIBILIDADE
   ============================================================ */

const TeddyPerf = {
    canIdle: 'requestIdleCallback' in window,
    reduceMotion: window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    raf(fn) {
        return requestAnimationFrame(fn);
    },

    idle(fn) {
        if (this.canIdle) {
            return requestIdleCallback(fn, { timeout: 300 });
        }

        return setTimeout(fn, 1);
    },

    debounce(fn, delay = 80) {
        let timer;

        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    setPressed(el, ativo) {
        if (!el) return;
        el.classList.toggle('is-pressed', ativo);
    }
};

const TeddyA11y = {
    selectors: 'button, .btn, .icon-btn, .tab-btn, .clear-all-btn, .clear-search, .card, [role="button"]',

    improveButton(el) {
        if (!el) return;

        if (!el.hasAttribute('type') && el.tagName === 'BUTTON') {
            el.setAttribute('type', 'button');
        }

        if (!el.hasAttribute('tabindex')) {
            el.setAttribute('tabindex', '0');
        }

        if (!el.hasAttribute('aria-label')) {
            const label = (el.innerText || el.textContent || el.title || 'Botão').trim();
            el.setAttribute('aria-label', label || 'Botão');
        }

        el.style.touchAction = 'manipulation';
    },

    improveCard(card) {
        if (!card) return;

        card.setAttribute('role', 'button');

        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }

        const titulo = card.querySelector('.item')?.textContent?.trim();
        const id = card.querySelector('span')?.textContent?.trim();

        if (titulo && !card.hasAttribute('aria-label')) {
            card.setAttribute('aria-label', `Abrir ${titulo}${id ? ' ' + id : ''}`);
        }

        card.style.touchAction = 'manipulation';
    },

    improveModal(modal) {
        if (!modal) return;

        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');

        if (!modal.hasAttribute('tabindex')) {
            modal.setAttribute('tabindex', '-1');
        }
    },

    apply(root = document) {
        root.querySelectorAll(this.selectors).forEach(el => {
            if (el.classList.contains('card')) {
                this.improveCard(el);
            } else {
                this.improveButton(el);
            }
        });

        root.querySelectorAll('.modal-overlay, .custom-modal-overlay, .custom-alert-overlay, .un-modal-overlay')
            .forEach(modal => this.improveModal(modal));
    }
};

function atualizarAcessibilidade() {
    TeddyPerf.idle(() => {
        TeddyA11y.apply();
    });
}

function abrirRapido(elemento) {
    if (!elemento) return;

    elemento.style.display = 'flex';
    elemento.classList.add('active');
    elemento.setAttribute('aria-hidden', 'false');

    TeddyA11y.improveModal(elemento);

    TeddyPerf.raf(() => {
        const foco = elemento.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (foco) foco.focus({ preventScroll: true });
    });
}

function fecharRapido(elemento) {
    if (!elemento) return;

    elemento.classList.remove('active');
    elemento.style.display = 'none';
    elemento.setAttribute('aria-hidden', 'true');
}

/* ============================================================
   FIM • HELPERS MODERNOS DE PERFORMANCE E ACESSIBILIDADE
   ============================================================ */


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
        <div class="card" data-id="${item.id}" role="button" tabindex="0" aria-label="Abrir ${item.name} id ${item.id}" onclick="openModal(${item.id})">
            ${verificarNovo(item.name) ? `<div class="badge-novo">novo<ion-icon name="sparkles-outline"></ion-icon></div>` : ""}

            <strong class="item">${item.name}</strong>
            <span>№ ${item.id}</span>
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
            atualizarAcessibilidade();
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
        }, 80);

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
                <button type="button" class="custom-alert-btn" aria-label="Confirmar alteração do modal automático" style="background:var(--success);color: var(--color_aviso_sim); flex:1;" onclick="executarTrocaModal()">Sim</button>
                <button class="custom-alert-btn" style="background:var(--danger); flex:1;
                color: var( --color_aviso);" aria-label="Cancelar alteração do modal automático" onclick="document.getElementById('confirmAutoModal').remove()">Não</button>
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

            <button type="button" class="custom-alert-btn" aria-label="Fechar aviso" onclick="document.getElementById('alertAutoModal').remove()">OK</button>
        </div>
    `;

    document.body.appendChild(alertBox);
}

function clearAllFavorites() {
    const modal = document.getElementById('confirmModal');

    if (modal) {
        abrirRapido(modal);
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
    }, 120);
}

function openTextModal(title, body) {
    fecharTecladoMobile();

    const titleEl = document.getElementById('textModalTitle');
    const bodyEl = document.getElementById('textModalBody');
    const modal = document.getElementById('textModal');

    if (!titleEl || !bodyEl || !modal) return;

    titleEl.innerText = title;
    bodyEl.innerText = body;
    abrirRapido(modal);
    bloquearScroll(true);
}

function closeModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        fecharRapido(modal);
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
    abrirRapido(itemModal);

    bloquearScroll(true);
    updateFavBtn();
}

function updateFavBtn() {
    const btn = document.getElementById('favBtn');
    
    if (!btn || !currentItem) return;
    
    const isFav = favorites.find(f => f.id === currentItem.id);
    
    btn.innerHTML = isFav ?
        '<i class="fas fa-star-half-alt"></i> Remover' :
        '<i class="fas fa-star"></i> Favoritar';
    
    btn.classList.toggle('favorited', !!isFav);
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
                    <button type="button" class="btn-modal-cancel" aria-label="Cancelar limpeza dos favoritos" onclick="closeModal('confirmModal')">Cancelar</button>
                    <button type="button" class="btn-modal-confirm" aria-label="Confirmar limpeza de todos os favoritos" onclick="executeClearAll()">Sim, limpar</button>
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

function showNotification(text) {
    const notification = document.createElement('div');
    
    notification.className = 'notification';
    notification.innerHTML = `
        <ion-icon name="notifications-outline"></ion-icon>
        <span>${text}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

function copyCommand() {
    if (!currentItem) return;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(`e ${currentItem.name}`);
    } else {
        const temp = document.createElement('textarea');
        temp.value = `e ${currentItem.name}`;
        temp.setAttribute('readonly', '');
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        temp.remove();
    }
    
    const btn = document.querySelector('.btn-copy');
    
    if (!btn) return;
    
    btn.innerHTML = '<i class="fas fa-check"></i> Pronto!';
    
    showNotification('Comando copiado com sucesso!');
    
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
        abrirRapido(overlay);
        bloquearScroll(true);
    };

    const close = () => {
        fecharRapido(overlay);
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
    atualizarAcessibilidade();
    registrarServiceWorker();
});



/* ============================================================
   INÍCIO • CAMADA EXTRA SEM REMOVER LINHAS ORIGINAIS
   Esta parte reforça clique instantâneo, teclado, aria e desempenho.
   ============================================================ */

document.addEventListener('pointerdown', (e) => {
    const alvo = e.target.closest(TeddyA11y.selectors);
    if (!alvo) return;

    TeddyPerf.setPressed(alvo, true);
}, { passive: true });

document.addEventListener('pointerup', (e) => {
    const alvo = e.target.closest(TeddyA11y.selectors);
    if (!alvo) return;

    TeddyPerf.setPressed(alvo, false);
}, { passive: true });

document.addEventListener('pointercancel', (e) => {
    const alvo = e.target.closest(TeddyA11y.selectors);
    if (!alvo) return;

    TeddyPerf.setPressed(alvo, false);
}, { passive: true });

document.addEventListener('keydown', (e) => {
    const alvo = document.activeElement;

    if (!alvo) return;

    const ehAcionavel =
        alvo.matches &&
        alvo.matches('.card, .btn, .icon-btn, .tab-btn, .clear-all-btn, .clear-search, [role="button"]');

    if (ehAcionavel && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        alvo.click();
    }

    if (e.key === 'Escape') {
        const modalAberto = document.querySelector(
            '.modal-overlay[style*="flex"], .custom-modal-overlay[style*="flex"], .custom-alert-overlay[style*="flex"], .un-modal-overlay[style*="flex"], .modal-overlay.active, .custom-modal-overlay.active, .custom-alert-overlay.active, .un-modal-overlay.active'
        );

        if (modalAberto && modalAberto.id) {
            closeModal(modalAberto.id);
        } else if (modalAberto) {
            fecharRapido(modalAberto);
            bloquearScroll(false);
        }

        const sidebar = document.getElementById('sidebar');

        if (sidebar && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    }
});

document.addEventListener('click', (e) => {
    const alvo = e.target.closest(TeddyA11y.selectors);
    if (!alvo) return;

    TeddyA11y.improveButton(alvo);

    if (alvo.classList.contains('card')) {
        TeddyA11y.improveCard(alvo);
    }
}, { passive: true });

const teddyObserver = new MutationObserver((mutations) => {
    let precisaAtualizar = false;

    for (const mutation of mutations) {
        if (mutation.addedNodes && mutation.addedNodes.length) {
            precisaAtualizar = true;
            break;
        }
    }

    if (precisaAtualizar) {
        atualizarAcessibilidade();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    atualizarAcessibilidade();

    teddyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    if (TeddyPerf.reduceMotion) {
        document.documentElement.classList.add('reduce-motion');
    }
});

/* Render otimizado com preservação da função original */
const renderItemsOriginal = renderItems;

renderItems = function renderItemsOtimizado() {
    renderItemsOriginal();

    TeddyPerf.raf(() => {
        atualizarAcessibilidade();
    });
};

/* Estado visual e ARIA das abas */
const switchTabOriginal = switchTab;

switchTab = function switchTabAcessivel(tab) {
    switchTabOriginal(tab);

    const tabAll = document.getElementById('tabAll');
    const tabFav = document.getElementById('tabFav');

    if (tabAll) {
        tabAll.setAttribute('aria-selected', tab === 'all' ? 'true' : 'false');
        tabAll.setAttribute('role', 'tab');
    }

    if (tabFav) {
        tabFav.setAttribute('aria-selected', tab === 'fav' ? 'true' : 'false');
        tabFav.setAttribute('role', 'tab');
    }
};

/* Bloqueio de scroll com ARIA */
const bloquearScrollOriginal = bloquearScroll;

bloquearScroll = function bloquearScrollAcessivel(ativo) {
    bloquearScrollOriginal(ativo);
    document.body.setAttribute('aria-busy', ativo ? 'true' : 'false');
};

/* ============================================================
   FIM • CAMADA EXTRA SEM REMOVER LINHAS ORIGINAIS
   ============================================================ */
