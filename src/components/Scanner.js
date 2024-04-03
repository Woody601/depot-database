import React, { useState, useRef, useEffect } from 'react';
import { BrowserBarcodeReader } from '@zxing/library';
import { Camera } from 'react-camera-pro';

const Scanner = () => {
  const [scannedResult, setScannedResult] = useState('');
  const [showModal, setShowModal] = useState(false);
  const cameraRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    initializeScanner();
  }, []);

  const initializeScanner = async () => {
    try {
      codeReader.current = new BrowserBarcodeReader();
      const videoDevices = await codeReader.current.listVideoInputDevices();

      if (videoDevices && videoDevices.length > 0) {
        const constraints = {
          deviceId: videoDevices[0].deviceId
        };

        codeReader.current.decodeFromInputVideoDevice(
          undefined,
          cameraRef.current.video,
          (result) => {
            setScannedResult(result.text);
            setShowModal(true);
            cameraRef.current.video.pause();
          },
          constraints
        );
      } else {
        console.error('No video input devices found');
      }
    } catch (error) {
      console.error('Error initializing scanner:', error);
      alert(
        "There was an error initializing the barcode scanner. Please make sure your camera is connected and try again."
      );
    }
  };

  const handleRescan = () => {
    setScannedResult('');s
    setShowModal(false);
    initializeScanner();
  };

  conx handleContinue = () => {
    // Implement continue functionality here
  };

  return (
    <div>
      {/* Apply mirror={false} to prevent mirroring of the video */}
      <Camera ref={cameraRef} mirror={false} />
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Scanned Barcode</h3>
            <p>{scannedResult}</p>
            <div className='modal-buttons'>
              <button onClick={handleRescan}>Rescan</button>
              <button onClick={handleContinue}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;
