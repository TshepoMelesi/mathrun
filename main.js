if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Register service worker
            navigator.serviceWorker.register('/service-worker.js')
                .then((registration) => {
                    console.log('✅ Service Worker registered:', registration);
                })
                .catch((error) => {
                    console.error('❌ Service Worker registration failed:', error);
                });
    
            let deferredPrompt = null;
    
            // Listen for the beforeinstallprompt event
            window.addEventListener('beforeinstallprompt', (event) => {
                console.log('ℹ️ beforeinstallprompt event fired');
    
                // Prevent default mini-infobar from appearing on mobile
                event.preventDefault();
    
                // Save the event for triggering later
                deferredPrompt = event;
    
                const installBtn = document.getElementById('install-btn');

                installBtn.style.display = 'block';
                installBtn.innerText = 'Install ASM On Your Mobile';

                if(installBtn){
                        window.addEventListener("appinstalled", () => {
                                console.log("App was installed")
                                installBtn.style.display = "none"
                        })
                }

                
    
                installBtn.addEventListener('click', () => {
                    if (!deferredPrompt) return;
    
                    // Show the install prompt
                    deferredPrompt.prompt();
    
                    // Wait for user's response
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('✅ User accepted the install prompt');
                        } else {
                            console.log('❌ User dismissed the install prompt');
                        }
    
                        // Clear the deferred prompt
                        deferredPrompt = null;
                        installBtn.style.display = 'none';
                    });
                });
            });
        });
    }
    