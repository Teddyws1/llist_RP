
        window.addEventListener('DOMContentLoaded', () => {
            const menuBtn = document.getElementById('menuBtn');
            const sidebar = document.getElementById('sidebar');
            const tabAll = document.getElementById('tabAll');
            const tabFav = document.getElementById('tabFav');

            const syncMenuState = () => {
                if (!menuBtn || !sidebar) return;

                menuBtn.setAttribute(
                    'aria-expanded',
                    sidebar.classList.contains('active') ? 'true' : 'false'
                );
            };

            document.addEventListener('click', () => {
                requestAnimationFrame(syncMenuState);
            }, { passive:true });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    const itemModal = document.getElementById('itemModal');
                    const textModal = document.getElementById('textModal');

                    if (itemModal && itemModal.style.display !== 'none') {
                        closeModal('itemModal');
                    }

                    if (textModal && textModal.style.display !== 'none') {
                        closeModal('textModal');
                    }

                    if (sidebar && sidebar.classList.contains('active')) {
                        toggleSidebar();
                    }
                }
            });

            const originalSwitchTab = window.switchTab;

            if (typeof originalSwitchTab === 'function') {
                window.switchTab = function(tab){
                    originalSwitchTab(tab);

                    if (tabAll) {
                        tabAll.setAttribute('aria-pressed', tab === 'all' ? 'true' : 'false');
                    }

                    if (tabFav) {
                        tabFav.setAttribute('aria-pressed', tab === 'fav' ? 'true' : 'false');
                    }
                };
            }

            syncMenuState();
        });
        
    
    
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('.settings web/sw.js')
                    .then(reg => {
                        console.log('SW registrado');
                        reg.update();
                    })
                    .catch(err => {
                        console.log('Erro SW:', err);
                    });
            });
        }
    