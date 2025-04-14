if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Register service worker
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => console.log('✅ Service Worker registered:', reg))
                .catch(err => console.error('❌ SW registration failed:', err));
    
            const installBtn = document.getElementById('install-btn');
    
            // ✅ Universal check for standalone mode (PWA installed)
            const isRunningStandalone = () => {
                return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
            };
    
            // 🟡 Hide button early if already installed
            if (installBtn && isRunningStandalone()) {
                console.log('📱 App is already installed and running in standalone mode');
                installBtn.style.display = 'none';
                return; // No need to show install prompt
            }
    
            let deferredPrompt = null;
    
            // Install prompt event
            window.addEventListener('beforeinstallprompt', (event) => {
                console.log('ℹ️ beforeinstallprompt fired');
                event.preventDefault();
                deferredPrompt = event;
    
                if (installBtn) {
                    installBtn.style.display = 'block';
                    installBtn.innerText = 'Install ASM on your mobile';
    
                    installBtn.addEventListener('click', () => {
                        if (!deferredPrompt) return;
    
                        deferredPrompt.prompt();
                        deferredPrompt.userChoice.then((choiceResult) => {
                            if (choiceResult.outcome === 'accepted') {
                                console.log('✅ User accepted the install prompt');
                            } else {
                                console.log('❌ User dismissed the install prompt');
                            }
    
                            installBtn.style.display = 'none';
                            deferredPrompt = null;
                        });
                    });
                }
            });
    
            // Installed event
            window.addEventListener('appinstalled', () => {
                console.log('🎉 App installed');
                if (installBtn) installBtn.style.display = 'none';
            });
        });
    }
    