export interface PWAServiceEvents {
    onInstallPrompt: (deferredPrompt: any) => void;
    onInstallSuccess: () => void;
    onInstallError: (error: any) => void;
}

export class PWAService {
    private events: PWAServiceEvents | null = null;
    private deferredPrompt: any = null;

    constructor(events?: PWAServiceEvents) {
        if (events) {
            this.events = events;
        }
    }

    public setupPWA(): void {
        try {
            this.setupInstallPrompt();
            this.setupServiceWorker();
        } catch (error) {
            console.error('Error setting up PWA:', error);
            this.events.onInstallError(error);
        }
    }

    private setupInstallPrompt(): void {
        window.addEventListener('beforeinstallprompt', (e: Event) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.events.onInstallPrompt(e);
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.events.onInstallSuccess();
            this.deferredPrompt = null;
        });
    }

    private setupServiceWorker(): void {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    public async installApp(deferredPrompt: any): Promise<string> {
        try {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    this.events.onInstallSuccess();
                }
                
                return outcome;
            }
            return 'dismissed';
        } catch (error) {
            this.events.onInstallError(error);
            throw error;
        }
    }

    public getDeferredPrompt(): any {
        return this.deferredPrompt;
    }

    // Methods expected by tests
    public setEventHandlers(events: PWAServiceEvents): void {
        this.events = events;
    }

    public isInstallable(): boolean {
        return this.deferredPrompt !== null;
    }

    public isInstalled(): boolean {
        return window.matchMedia('(display-mode: standalone)').matches ||
               (window.navigator as any).standalone === true;
    }

    public isServiceWorkerSupported(): boolean {
        return 'serviceWorker' in navigator;
    }

    public async requestInstall(): Promise<string> {
        if (this.deferredPrompt) {
            return this.installApp(this.deferredPrompt);
        }
        return 'no-prompt-available';
    }

    public async registerServiceWorker(): Promise<void> {
        if (this.isServiceWorkerSupported()) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('SW registered: ', registration);
            } catch (error) {
                console.log('SW registration failed: ', error);
                if (this.events) {
                    this.events.onInstallError(error);
                }
                throw error;
            }
        }
    }

    // Additional methods expected by tests
    public promptInstall(): void {
        if (this.deferredPrompt) {
            this.installApp(this.deferredPrompt);
        }
    }

    public handleInstallPrompt(event: any): void {
        this.deferredPrompt = event;
        if (this.events) {
            this.events.onInstallPrompt(event);
        }
    }

    public handleInstallSuccess(): void {
        this.deferredPrompt = null;
        if (this.events) {
            this.events.onInstallSuccess();
        }
    }

    public handleInstallError(error: any): void {
        if (this.events) {
            this.events.onInstallError(error);
        }
    }
}
