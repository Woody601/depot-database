import React, { useEffect } from 'react';

function ResultsOverlay({ result, onRescan, onClose }) {
  useEffect(() => {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
    return () => {
      overlay.style.display = 'none';
    };
  }, []);

  return (
    <div id="overlay" style={{ display: 'none', position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', zIndex: '9999' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <label>Result:</label>
        <pre><code>{result}</code></pre>
        <button onClick={onRescan}>Rescan</button>
        <button onClick={onClose}>Continue</button>
      </div>
    </div>
  );
}

export default ResultsOverlay;
