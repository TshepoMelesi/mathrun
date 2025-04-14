if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => console.log('✅ Service Worker registered:', reg))
                .catch(err => console.error('❌ Service Worker registration failed:', err));
    
            const installBtn = document.getElementById('install-btn');
    
            // Check if app is running in standalone mode or was previously installed
            function isAppInstalled() {
                const standalone = window.matchMedia('(display-mode: standalone)').matches;
                const iosStandalone = window.navigator.standalone === true;
                const chromeLaunched = document.referrer.startsWith('android-app://');
                const localInstalled = localStorage.getItem('asm_installed') === 'true';
    
                return standalone || iosStandalone || chromeLaunched || localInstalled;
            }
    
            // Early check – hide button if app is already installed
            if (installBtn && isAppInstalled()) {
                console.log('📱 App is already installed');
                installBtn.style.display = 'none';
            }
    
            let deferredPrompt = null;
    
            window.addEventListener('beforeinstallprompt', (event) => {
                console.log('🟡 beforeinstallprompt fired');
                event.preventDefault();
                deferredPrompt = event;
    
                if (!isAppInstalled()) {
                    installBtn.style.display = 'block';
                    installBtn.innerText = 'Install ASM on your device';
    
                    installBtn.addEventListener('click', () => {
                        if (!deferredPrompt) return;
    
                        deferredPrompt.prompt();
    
                        deferredPrompt.userChoice.then((choiceResult) => {
                            if (choiceResult.outcome === 'accepted') {
                                console.log('✅ User accepted the install prompt');
                                installBtn.style.display = 'none';
                            } else {
                                console.log('❌ User dismissed the install prompt');
                            }
    
                            deferredPrompt = null;
                        });
                    });
                }
            });
    
            // Confirmed installation event
            window.addEventListener('appinstalled', () => {
                console.log('🎉 App installed');
                localStorage.setItem('asm_installed', 'true');
                if (installBtn) installBtn.style.display = 'none';
            });
        });
    }
    