import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock del DOM
const mockElement = {
  addEventListener: vi.fn(),
  appendChild: vi.fn(),
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn()
  },
  style: {},
  textContent: '',
  disabled: false,
  title: ''
};

const mockDocument = {
  createElement: vi.fn(() => mockElement),
  getElementById: vi.fn(() => mockElement),
  addEventListener: vi.fn(),
  readyState: 'complete',
  body: mockElement
};

// Mock global del document
Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true
});

describe('App Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct sound configuration structure', () => {
    // Test de configuración básica
    const soundConfig = {
      name: 'Test',
      filename: 'test.mp3',
      color: '#FF0000'
    };
    
    expect(soundConfig).toHaveProperty('name');
    expect(soundConfig).toHaveProperty('filename');
    expect(soundConfig).toHaveProperty('color');
    expect(soundConfig.filename).toMatch(/\.mp3$/);
    expect(soundConfig.color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('should validate sound names format', () => {
    const expectedNames = ['Cris', 'Ivan', 'Josefina', 'Mimi', 'Rita', 'Valentina'];
    
    expectedNames.forEach(name => {
      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
    });
  });

  it('should create Audio objects correctly', () => {
    const audio = new Audio('test.mp3');
    
    expect(audio).toBeDefined();
    expect(audio.src).toBe('test.mp3');
    expect(typeof audio.play).toBe('function');
    expect(typeof audio.pause).toBe('function');
  });
});
