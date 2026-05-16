/* =========================================================
  sistema de contagem crescente (com memória)
   ========================================================= */

// CONTROLE DO SISTEMA: para desativar usa:"false" e para ativar usa: "true",
let sistemaContagemAtivo = true; 

let atualizacaoInterval;

document.addEventListener("DOMContentLoaded", () => {
    const progressPercentage = document.getElementById("progress-percentage");
    
    // Ajustado para exatamente 5 minutos no total (5 minutos * 60 segundos * 1000ms = 120000ms)
    const tempoTotalContagem = 150000; 

    // Se o sistema estiver definido como false logo de início, o código nem começa a contar
    if (!sistemaContagemAtivo) {
        progressPercentage.textContent = ""; // Deixa vazio ou esconde
        return; 
    }

    // SISTEMA DE MEMÓRIA: Recupera o início exato. Se não existir, aí sim cria um novo.
    let inicioContagem = localStorage.getItem("inicioContagemRegressiva");
    const agora = Date.now();

    if (!inicioContagem) {
        localStorage.setItem("inicioContagemRegressiva", agora);
        inicioContagem = agora;
    }

    // Função interna que calcula o tempo decorrido real e atualiza a tela
    const atualizarContagemCrescente = () => {
        // Segunda checagem de segurança: se o sistema mudar para false enquanto estiver rodando, ele para na hora
        if (!sistemaContagemAtivo) {
            clearInterval(atualizacaoInterval);
            return;
        }

        const tempoPassado = Date.now() - parseInt(inicioContagem);
        
        // Calcula a porcentagem que já passou com base no relógio do sistema
        let porcentagemPassada = Math.floor((tempoPassado / tempoTotalContagem) * 100);

        // Garante que a porcentagem fique entre 0 e 100
        if (porcentagemPassada < 0) porcentagemPassada = 0;
        if (porcentagemPassada > 100) porcentagemPassada = 100;

        progressPercentage.textContent = `${porcentagemPassada}%`;

        // Se o tempo acabou (chegou a 100%), encerra o sistema e limpa a memória
        if (porcentagemPassada >= 100) {
            clearInterval(atualizacaoInterval);
            localStorage.removeItem("inicioContagemRegressiva"); // Limpa para uma próxima atualização futura
            
            setTimeout(() => {
                progressPercentage.classList.add("loader-hidden");
            }, 1000); 
        }
    };

    // Roda a primeira checagem imediatamente ao carregar a página para o número não iniciar em 0% por erro visual
    atualizarContagemCrescente();

    // Atualiza a cada 100ms para manter o número subindo de onde parou de forma fluida
    atualizacaoInterval = setInterval(atualizarContagemCrescente, 100);
});
