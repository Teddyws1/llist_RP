let deferredPrompt = null;
const installBtn = document.getElementById("installAppBtn");

installBtn.style.display = "none";

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "flex";
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  
  deferredPrompt.prompt();
  
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === "accepted") {
    console.log("Aplicativo instalado.");
  }
  
  deferredPrompt = null;
  installBtn.style.display = "none";
});

window.addEventListener("appinstalled", () => {
  console.log("Instalação concluída.");
  installBtn.style.display = "none";
});