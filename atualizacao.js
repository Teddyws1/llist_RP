/* =========================================================
   [INÍCIO] - MODAL DE ATUALIZAÇÕES (ROBUSTO E SEGURO)
   ========================================================= */
function openUpdateModal() {
    if (document.getElementById("updateModal")) return;
    
    const updates = [
        '<ion-icon name="color-palette-outline"></ion-icon> Visual da interface renovado',
        '<ion-icon name="document-text-outline"></ion-icon> Descrição adicionada a todos os os cards',
        '<ion-icon name="construct-outline"></ion-icon> Ajustes internos e correções',
        '<ion-icon name="add-circle-outline"></ion-icon> Mais de 50 novos comandos',
        '<ion-icon name="flash-outline"></ion-icon> Melhorias no sistema',
        '<ion-icon name="folder-open-outline"></ion-icon> Duas novas abas por categorias'
    ];
    
    const limite = 3;
    
    const upModal = document.createElement("div");
    upModal.className = "custom-alert-overlay";
    upModal.id = "updateModal";
    
    document.body.classList.add("modal-aberto");
    
    const fecharModal = () => {
        document.body.classList.remove("modal-aberto");
        upModal.remove();
    };
    
    upModal.addEventListener("click", (e) => {
        if (e.target === upModal) fecharModal();
    });
    
    upModal.innerHTML = `
        <div class="update-card">

            <div class="update-header">
                <span class="update-title">ATUALIZAÇÕES</span>

                <div class="update-version">
                    <ion-icon name="git-branch-outline"></ion-icon>
                    <span>Versão 4.8.0 Beta</span>
                </div>
            </div>

            <ul class="update-list" id="lista-updates">
                ${updates
                    .map(
                        (item, index) => `
                    <li class="item-lista ${index >= limite ? "escondido" : ""}"
                        ${index >= limite ? 'style="display:none"' : ""}>
                        ${item}
                    </li>
                `
                    )
                    .join("")}
            </ul>

            ${
                updates.length > limite
                    ? `
                <button id="btn-toggle" class="update-btn-ver-mais">
                    <span class="btn-text">Ver mais</span>
                    <ion-icon class="btn-icon" name="chevron-down-outline"></ion-icon>
                </button>
            `
                    : ""
            }

            <button class="update-btn-ok" id="btn-ok-final">
                OK
            </button>

        </div>
    `;
    
    document.body.appendChild(upModal);
    
    upModal.querySelector("#btn-ok-final").addEventListener("click", fecharModal);
    
    const btnToggle = upModal.querySelector("#btn-toggle");
    
    if (btnToggle) {
        const itensExtras = [...upModal.querySelectorAll(".item-lista.escondido")];
        const btnText = btnToggle.querySelector(".btn-text");
        const btnIcon = btnToggle.querySelector(".btn-icon");
        
        let expandido = false;
        
        btnToggle.addEventListener("click", () => {
            expandido = !expandido;
            
            itensExtras.forEach((item) => {
                item.style.display = expandido ? "flex" : "none";
            });
            
            btnText.textContent = expandido ? "Ver menos" : "Ver mais";
            btnIcon.setAttribute(
                "name",
                expandido ?
                "chevron-up-outline" :
                "chevron-down-outline"
            );
        });
    }
}/* =========================================================
   [FIM] - MODAL DE ATUALIZAÇÕES
   ========================================================= */
