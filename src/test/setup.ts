// Setup simple para tests
import { vi } from 'vitest';

// Mock básico del Google Cast SDK
Object.defineProperty(window, 'cast', {
  value: {
    framework: {
      CastContext: {
        getInstance: vi.fn(() => ({
          setOptions: vi.fn(),
          addEventListener: vi.fn(),
          getCastState: vi.fn(() => 'NOT_CONNECTED'),
          getCurrentSession: vi.fn(() => null),
          requestSession: vi.fn()
        }))
      },
      AutoJoinPolicy: {
        ORIGIN_SCOPED: 'origin_scoped'
      },
      CastState: {
        NO_DEVICES_AVAILABLE: 'NO_DEVICES_AVAILABLE',
        NOT_CONNECTED: 'NOT_CONNECTED',
        CONNECTING: 'CONNECTING',
        CONNECTED: 'CONNECTED'
      },
      CastContextEventType: {
        CAST_STATE_CHANGED: 'caststatechanged',
        SESSION_STATE_CHANGED: 'sessionstatechanged'
      }
    }
  },
  writable: true
});

// Mock básico de Audio
class MockAudio {
  src: string = '';
  currentTime: number = 0;
  paused: boolean = true;
  
  constructor(src?: string) {
    if (src) this.src = src;
  }
  
  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();
  load = vi.fn();
  
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}

Object.defineProperty(window, 'Audio', {
  value: MockAudio,
  writable: true
});

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock de location
Object.defineProperty(window, 'location', {
  value: {
    protocol: 'http:',
    hostname: 'localhost',
    origin: 'http://localhost:4001',
    pathname: '/'
  },
  writable: true
});

// Mock de console para tests silenciosos
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
};
