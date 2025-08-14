import { SoundFile } from '../config';

export interface UIEventHandlers {
    onSoundClick: (soundName: string) => void;
    onCastClick: () => void;
    onCloseClick: () => void;
}

export class UIComponents {
    private eventHandlers: UIEventHandlers | null = null;

    public setEventHandlers(handlers: UIEventHandlers): void {
        this.eventHandlers = handlers;
    }

    public renderSoundButtons(soundFiles: SoundFile[]): void {
        const container = document.getElementById('soundGrid');
        if (!container) {
            console.error('Sound grid container not found');
            return;
        }

        // Limpiar contenido existente
        container.innerHTML = '';

        const fragment = document.createDocumentFragment();
        const micIconSVG = this.getMicIconSVG();

        soundFiles.forEach((sound: SoundFile) => {
            const button = this.createSoundButton(sound, micIconSVG);
            fragment.appendChild(button);
        });

        container.appendChild(fragment);
        this.attachSoundButtonEvents();
    }

    private createSoundButton(sound: SoundFile, micIconSVG: string): HTMLButtonElement {
        const button = document.createElement('button');
        button.className = 'sound-button';
        button.dataset.sound = sound.name;
        button.setAttribute('aria-label', `Reproducir sonido ${sound.name}`);

        button.innerHTML = `
            <div class="icon-container">
                ${micIconSVG}
            </div>
            <span class="sound-name">${sound.name}</span>
        `;

        // Aplicar color dinámico
        button.style.backgroundColor = sound.color;

        return button;
    }

    private getMicIconSVG(): string {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mic-icon">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
        `;
    }

    private attachSoundButtonEvents(): void {
        const soundGrid = document.getElementById('soundGrid');
        if (soundGrid && this.eventHandlers) {
            soundGrid.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLElement;
                const button = target.closest('.sound-button') as HTMLButtonElement;
                
                if (button && button.dataset.sound && this.eventHandlers) {
                    this.eventHandlers.onSoundClick(button.dataset.sound);
                }
            });
        }
    }

    public attachControlEvents(): void {
        if (!this.eventHandlers) return;

        const castBtn = document.getElementById('googleBtn');
        if (castBtn) {
            castBtn.addEventListener('click', () => {
                if (this.eventHandlers) {
                    this.eventHandlers.onCastClick();
                }
            });
        }

        const closeBtn = document.getElementById('closeBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (this.eventHandlers) {
                    this.eventHandlers.onCloseClick();
                }
            });
        }
    }

    public updateSoundButtonStates(disabledButtons: string[], activeButton?: string): void {
        const buttons = document.querySelectorAll('.sound-button');
        
        buttons.forEach((btn: Element) => {
            const button = btn as HTMLButtonElement;
            const soundName = button.dataset.sound;

            if (!soundName) return;

            // Resetear estados
            button.disabled = false;
            button.classList.remove('opacity-50', 'cursor-not-allowed', 'ring-4');

            // Aplicar estados según parámetros
            if (disabledButtons.includes(soundName)) {
                button.disabled = true;
                button.classList.add('opacity-50', 'cursor-not-allowed');
            }

            if (activeButton === soundName) {
                button.classList.add('ring-4');
            }
        });
    }

    public updateSoundButton(soundName: string, state: 'playing' | 'stopped' | 'error'): void {
        const button = document.querySelector(`[data-sound="${soundName}"]`) as HTMLButtonElement;
        if (!button) return;

        // Remover todos los estados anteriores
        button.classList.remove('playing', 'stopped', 'error', 'ring-4', 'opacity-50');

        switch (state) {
            case 'playing':
                button.classList.add('ring-4', 'playing');
                button.disabled = false;
                break;
            case 'stopped':
                button.classList.remove('ring-4', 'playing');
                button.disabled = false;
                break;
            case 'error':
                button.classList.add('error', 'opacity-50');
                button.disabled = true;
                break;
        }
    }

    public updateCastButton(isConnected: boolean, isConnecting: boolean, deviceName?: string, devicesAvailable: boolean = true): void {
        const button = document.getElementById('googleBtn') as HTMLButtonElement;
        if (!button) return;

        // Actualizar disponibilidad de dispositivos
        if (devicesAvailable) {
            button.classList.remove('no-devices');
            button.disabled = false;
            button.title = 'Conectar a Google Cast';
        } else {
            button.classList.add('no-devices');
            button.disabled = true;
            button.title = 'No hay dispositivos Google Cast disponibles';
        }

        // Actualizar estado de conexión
        if (isConnecting) {
            button.textContent = '⏳';
            button.classList.add('connecting');
            button.classList.remove('connected');
            button.disabled = true;
            button.title = 'Conectando...';
        } else if (isConnected) {
            button.textContent = '📡';
            button.classList.add('connected');
            button.classList.remove('connecting');
            button.disabled = false;
            button.title = `Conectado a ${deviceName || 'dispositivo Cast'}`;
        } else {
            button.textContent = '📡';
            button.classList.remove('connected', 'connecting');
            button.title = devicesAvailable ? 'Conectar a Google Cast' : 'No hay dispositivos disponibles';
        }
    }

    public showNotification(message: string, duration: number = 3000): void {
        const notificationEl = document.getElementById('notification');
        if (!notificationEl) {
            console.warn('Notification element not found');
            return;
        }

        notificationEl.textContent = message;
        notificationEl.classList.remove('hidden');

        setTimeout(() => {
            notificationEl.classList.add('hidden');
        }, duration);
    }

    public showInstallPrompt(deferredPrompt: any): void {
        const installPromptEl = document.getElementById('install-prompt');
        const installBtn = document.getElementById('install-btn');
        if (!installPromptEl || !installBtn) return;

        installPromptEl.classList.remove('hidden');

        installBtn.onclick = async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Resultado de instalación: ${outcome}`);
                installPromptEl.classList.add('hidden');
            }
        };
    }

    // Methods expected by tests
    public render(soundFiles: SoundFile[]): void {
        this.renderSoundButtons(soundFiles);
        this.attachControlEvents();
    }

    public handleSoundClick(soundName: string): void {
        if (this.eventHandlers) {
            this.eventHandlers.onSoundClick(soundName);
        }
    }

    public handleCastClick(): void {
        if (this.eventHandlers) {
            this.eventHandlers.onCastClick();
        }
    }



    public getRenderedButtons(): HTMLElement[] {
        const buttons = document.querySelectorAll('.sound-button');
        return Array.from(buttons) as HTMLElement[];
    }

    public getCastButton(): HTMLElement | null {
        return document.getElementById('googleBtn');
    }

    public hideInstallPrompt(): void {
        const installPromptEl = document.getElementById('install-prompt');
        if (installPromptEl) {
            installPromptEl.classList.add('hidden');
        }
    }
}
