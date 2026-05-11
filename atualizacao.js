/* =========================================================
   [INÍCIO] - MODAL DE ATUALIZAÇÕES (FECHA AO CLICAR FORA)
   ========================================================= */
function openUpdateModal() {
    const updates = [
        "ajustes nos botões e interface",
        "Sistema de busca otimizado",
        "sistema de modal automático que mostra resultado de busca",
        "sistema de desativar/ativar AT",
        "novas aba de sobre atualização",
        
    ];

    const upModal = document.createElement('div');
    upModal.className = 'custom-alert-overlay'; // Este é o fundo escuro
    upModal.id = 'updateModal';

    // EVENTO CHAVE: Se o clique for exatamente no fundo (upModal), remove o modal
    upModal.onclick = function(event) {
        if (event.target === upModal) {
            upModal.remove();
        }
    };

    upModal.innerHTML = `
        <div class="update-card">
            <div class="update-header">
                <span class="update-title">Atualizações</span>
            </div>
            
            <ul class="update-list">
                ${updates.map(item => `
                    <li><i class="fas fa-check"></i> ${item}</li>
                `).join('')}
            </ul>

            <button class="update-btn-ok" onclick="document.getElementById('updateModal').remove()">OK</button>
                        <p class="un-header-subtitle">2.6.7 versão atual</p>
        </div>
        
    `;

    document.body.appendChild(upModal);
}
/* =========================================================
   [FIM] - MODAL DE ATUALIZAÇÕES
   ========================================================= */
