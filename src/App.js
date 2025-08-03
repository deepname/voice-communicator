import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [sounds, setSounds] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);

  // Lista de archivos de sonido disponibles
  const soundFiles = [
    { name: 'Cris', file: 'Cris.aac', color: '#FF6B6B' },
    { name: 'Ivan', file: 'Ivan.aac', color: '#4ECDC4' },
    { name: 'Josefina', file: 'Josefina.aac', color: '#45B7D1' },
    { name: 'Mimi', file: 'Mimi.aac', color: '#96CEB4' },
    { name: 'Rita', file: 'Rita.aac', color: '#FFEAA7' },
    { name: 'Valentina', file: 'Valentina.aac', color: '#DDA0DD' }
  ];

  useEffect(() => {
    // Precargar los archivos de audio
    const loadedSounds = soundFiles.map(sound => ({
      ...sound,
      audio: new Audio(`/sound/${sound.file}`)
    }));
    setSounds(loadedSounds);
  }, []);

  const playSound = (sound) => {
    if (sound.audio) {
      sound.audio.currentTime = 0;
      sound.audio.play().catch(error => {
        console.error('Error reproduciendo sonido:', error);
      });
    }
  };

  const handleClose = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar la aplicación?')) {
      window.close();
    }
  };

  const handleGoogleConnect = () => {
    setIsConnecting(true);
    // Simular conexión a Google Cast
    setTimeout(() => {
      setIsConnecting(false);
      alert('Funcionalidad de Google Cast en desarrollo');
    }, 2000);
  };

  return (
    <div className="app">
      <header className="app-header">
        <button className="header-btn close-btn" onClick={handleClose}>
          ✕
        </button>
        <h1 className="app-title">Voice Communicator</h1>
        <button 
          className={`header-btn google-btn ${isConnecting ? 'connecting' : ''}`}
          onClick={handleGoogleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? '🔄' : '📡'}
        </button>
      </header>

      <main className="sound-grid">
        {sounds.map((sound, index) => (
          <button
            key={sound.name}
            className="sound-button"
            style={{ backgroundColor: sound.color }}
            onClick={() => playSound(sound)}
          >
            <span className="sound-name">{sound.name}</span>
          </button>
        ))}
      </main>
    </div>
  );
};

export default App;
