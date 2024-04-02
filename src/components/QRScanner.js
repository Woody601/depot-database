import React, { useState, useEffect, useRef } from 'react';
import { BrowserBarcodeReader } from '@zxing/library';

const QRScanner = () => {
  const [result, setResult] = useState('');
  const [showModal, setShowModal] = useState(false);
  const cameraRef = useRef(null);
  const codeReader = useRef(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        // Find the rear camera (facingMode: 'environment') if available
        const rearCamera = videoDevices.find(device => device.label.toLowerCase().includes('back') || device.facingMode === 'environment');

        // Use the first available camera if rear camera not found
        const selectedCamera = rearCamera || videoDevices[0];

        if (selectedCamera) {
          setSelectedDeviceId(selectedCamera.deviceId);
          const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedCamera.deviceId } });
          cameraRef.current.srcObject = stream;
          cameraRef.current.play().catch(error => console.error('Error playing camera:', error));
          codeReader.current = new BrowserBarcodeReader();
          scanBarcode(); // Start scanning process
        } else {
          console.error('No video devices found');
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initializeScanner();

    return () => {
      if (cameraRef.current.srcObject) {
        const tracks = cameraRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const scanBarcode = async () => {
    try {
      console.log('Scanning barcode...');
      const newResult = await codeReader.current.decodeFromVideoElement(cameraRef.current);
      console.log('Decoded result:', newResult);
      setResult(newResult.text);
      setShowModal(true); // Show modal when barcode is detected
      cameraRef.current.pause(); // Pause the camera stream after scanning a barcode
    } catch (error) {
      console.error('Barcode scanning error:', error);
      // If scanning fails, try again after a short delay
      setTimeout(scanBarcode, 1000);
    }
  };

  const handleRescan = () => {
    // Reset the result
    setResult('');
    
    // Pause the camera stream if it's playing
    if (!cameraRef.current.paused) {
      cameraRef.current.pause();
    }
  
    // Reinitialize the barcode reader instance
    codeReader.current = new BrowserBarcodeReader();
  
    // Start scanning process after a slight delay
    setTimeout(() => {
      scanBarcode();
    }, 500); // Adjust the delay as needed
    
    // Hide the modal
    setShowModal(false);
  };
  
  const handleContinue = () => {
    // Continue with whatever action you need
  };

  return (
    <div>
      <h2>Barcode and QR Code Scanner</h2>
      <video ref={cameraRef} width="300" height="200" autoPlay></video>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Scanned Barcode</h3>
            <p>{result}</p>
            <button onClick={handleRescan}>Rescan</button>
            <button onClick={handleContinue}>Continue</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
