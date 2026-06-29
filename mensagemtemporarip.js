let mensagemAtual = null;
let cliqueBotao = 0;
let autoCloseTimeout = null;

function mostrarMensagem() {
    
    cliqueBotao++;
    
    // Fecha ao clicar 3 vezes no botão
    if (cliqueBotao >= 3) {
        fecharMensagem();
        cliqueBotao = 0;
        return;
    }
    
    if (mensagemAtual) return;
    
    const mensagem = document.createElement("div");
    
    mensagem.className = "mensagem";
    mensagem.innerHTML = `
      <div class="titulo">
    <ion-icon name="alert-outline" class="alert-icon"></ion-icon>
    Comandos do Servidor
</div>

       <div class="texto">
    o botão de <strong>Comandos do Servidor</strong> está em fase de desenvolvimento.
    <br>
    <strong class="disponivel">função disponível futuramente.</strong>
</div>

        <div class="contador">
            Deslize para a direita para fechar →
        </div>
    `;
    
    document.body.appendChild(mensagem);
    mensagemAtual = mensagem;
    
    setTimeout(() => {
        mensagem.classList.add("ativa");
    }, 10);
    
    // Fecha automaticamente após 17 segundos
    autoCloseTimeout = setTimeout(() => {
        fecharMensagem();
    }, 17000);
    
    /* DESLIZAR PARA FECHAR */
    
    let inicioX = 0;
    
    mensagem.addEventListener("touchstart", (e) => {
        inicioX = e.touches[0].clientX;
    });
    
    mensagem.addEventListener("touchmove", (e) => {
        if (!inicioX) return;
        
        const atualX = e.touches[0].clientX;
        const distancia = atualX - inicioX;
        
        if (distancia > 120) {
            fecharMensagem();
        }
    });
    
    mensagem.addEventListener("mousedown", (e) => {
        inicioX = e.clientX;
    });
    
    mensagem.addEventListener("mouseup", (e) => {
        const distancia = e.clientX - inicioX;
        
        if (distancia > 120) {
            fecharMensagem();
        }
    });
}

function fecharMensagem() {
    
    if (!mensagemAtual) return;
    
    clearTimeout(autoCloseTimeout);
    
    mensagemAtual.classList.remove("ativa");
    
    mensagemAtual.style.transform = "translateX(400px)";
    mensagemAtual.style.opacity = "0";
    
    setTimeout(() => {
        
        if (mensagemAtual) {
            mensagemAtual.remove();
            mensagemAtual = null;
        }
        
    }, 300);
}