/* =========================================================
   [INÍCIO] - MODAL DE ATUALIZAÇÕES (ROBUSTO E SEGURO)
   ========================================================= */
function openUpdateModal() {
    // 1. Trava de segurança: Se o modal já existir, não faz nada
    if (document.getElementById('updateModal')) return;

    const updates = [
    "novo sistema de compartilhamento integrado",
    "novo modal de compartilhamento na aba 'Sobre o Sistema'",
    "3 novas categorias de ordens",
    "novo sistema de badges para comandos recentes",
    "aprimoramento da pesquisa por palavras-chave",
    "sistema AT automático otimizado",
    "fechamento automático do teclado em dispositivos móveis ao abrir modais",
    "nova interface da aba 'Sobre o Sistema'",
    "nova seção do desenvolvedor",
    "melhorias visuais em todo o sistema v2.1",
    "ajustes de responsividade para diferentes tamanhos de tela",
    "refatoração e organização dos estilos CSS v2.0",
    "otimização do código JavaScript v1.0",
    "melhorias internas de desempenho e manutenção",
    "correções de bugs visuais v2.0",
    "novos comandos adicionados","sistema de status de atualização na aba de sobre sistema",
        "contagem regressiva da data de atualização"
    ];

    const limite = 3;
    const upModal = document.createElement('div');
    upModal.className = 'custom-alert-overlay';
    upModal.id = 'updateModal';

    // 2. Bloqueia scroll do Body
    document.body.classList.add('modal-aberto');

    // Função interna para fechar com segurança
    const fecharModal = () => {
        document.body.classList.remove('modal-aberto');
        upModal.remove();
    };

    // Evento de clique para fechar ao clicar no overlay
    upModal.onclick = (e) => { if (e.target === upModal) fecharModal(); };

    // Monta o HTML
    upModal.innerHTML = `
        <div class="update-card">
            <div class="update-header">
                <span class="update-title">ATUALIZAÇÕES</span>
            </div>
            
            <ul class="update-list" id="lista-updates">
                ${updates.map((item, index) => `
                    <li class="item-lista ${index >= limite ? 'escondido' : ''}">
                        <i class="fas fa-check"></i> ${item}
                    </li>
                `).join('')}
            </ul>

            ${updates.length > limite ? `
                <button id="btn-toggle" class="update-btn-ver-mais">
                    <span class="btn-text">Ver mais</span> <i class="fas fa-arrow-down"></i>
                </button>
            ` : ''}

            <button class="update-btn-ok" id="btn-ok-final">OK</button>
        </div>
    `;

    document.body.appendChild(upModal);

    // Evento do botão OK
    upModal.querySelector('#btn-ok-final').onclick = fecharModal;

    // Lógica de "Ver mais" / "Ver menos"
    const btnToggle = upModal.querySelector('#btn-toggle');
    if (btnToggle) {
        const itensExtras = upModal.querySelectorAll('.item-lista.escondido');
        const btnText = btnToggle.querySelector('.btn-text');
        const btnIcon = btnToggle.querySelector('i');

        btnToggle.onclick = () => {
            const expandindo = itensExtras[0].style.display !== 'flex';
            itensExtras.forEach(el => el.style.display = expandindo ? 'flex' : 'none');
            
            btnText.textContent = expandindo ? 'Ver menos' : 'Ver mais';
            btnIcon.className = expandindo ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
        };
    }
}
/* =========================================================
   [FIM] - MODAL DE ATUALIZAÇÕES
   ========================================================= */
