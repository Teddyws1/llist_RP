/* =========================================================
  sistema de contagem regressiva
   ========================================================= */

// CONTROLE DO SISTEMA: para desativar usa:"false" e para ativar usa: "true",
let sistemaContagemAtivo = true; 

let atualizacaoInterval;

document.addEventListener("DOMContentLoaded", () => {
    const progressPercentage = document.getElementById("progress-percentage");
    let progress = 0;
    const tempoPorPercentual = 13000; // 13 segundos no total

    // Se o sistema estiver definido como false logo de início, o código nem começa a contar
    if (!sistemaContagemAtivo) {
        progressPercentage.textContent = ""; // Deixa vazio ou esconde
        return; 
    }

    atualizacaoInterval = setInterval(() => {
        // Segunda checagem de segurança: se o sistema mudar para false enquanto estiver rodando, ele para na hora
        if (!sistemaContagemAtivo) {
            clearInterval(atualizacaoInterval);
            return;
        }

        progress++;
        progressPercentage.textContent = `${progress}%`;

        if (progress >= 100) {
            clearInterval(atualizacaoInterval);
            
            setTimeout(() => {
                progressPercentage.classList.add("loader-hidden");
            }, 1000); 
        }
    }, tempoPorPercentual);
});
