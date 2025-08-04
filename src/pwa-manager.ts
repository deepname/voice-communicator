export class PWAManager {
    private onShowInstallPrompt: (deferredPrompt: any) => void;

    constructor(onShowInstallPrompt: (deferredPrompt: any) => void) {
        this.onShowInstallPrompt = onShowInstallPrompt;
    }

    public setupPWA(): void {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then((registration: ServiceWorkerRegistration) => {
                        console.log('✅ SW registrado:', registration);
                    })
                    .catch((registrationError: Error) => {
                        console.log('❌ SW falló:', registrationError);
                    });
            });
        }

        window.addEventListener('beforeinstallprompt', (e: Event) => {
            e.preventDefault();
            // Guardar el evento para poder mostrar el aviso más tarde
            this.onShowInstallPrompt(e);
        });

        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA instalada');
        });
    }
}
