if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('✅ Service Worker registered:', registration);
                })
                .catch((error) => {
                    console.error('❌ Service Worker registration failed:', error);
                });
    
            const installBtn = document.getElementById('install-btn');
    
            // 👉 Check if app is already installed or running in standalone
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    
            if (isStandalone) {
                console.log("📱 App is running in standalone mode");
                if (installBtn) installBtn.style.display = 'none';
                return; // Exit early, no need to show install prompt
            }
    
            let deferredPrompt = null;
    
            // Listen for beforeinstallprompt
            window.addEventListener('beforeinstallprompt', (event) => {
                console.log('ℹ️ beforeinstallprompt event fired');
                event.preventDefault();
                deferredPrompt = event;
    
                if (installBtn) {
                    installBtn.style.display = 'block';
                    installBtn.innerText = 'Install ASM On Your Mobile';
    
                    installBtn.addEventListener('click', () => {
                        if (!deferredPrompt) return;
    
                        deferredPrompt.prompt();
    
                        deferredPrompt.userChoice.then((choiceResult) => {
                            if (choiceResult.outcome === 'accepted') {
                                console.log('✅ User accepted the install prompt');
                            } else {
                                console.log('❌ User dismissed the install prompt');
                            }
    
                            deferredPrompt = null;
                            installBtn.style.display = 'none';
                        });
                    });
                }
            });
    
            // Listen for appinstalled event
            window.addEventListener('appinstalled', () => {
                console.log('🎉 App was installed');
                if (installBtn) installBtn.style.display = 'none';
            });
        });
    }
    