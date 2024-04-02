import React, { useState, useEffect, useRef } from 'react';
import { BrowserBarcodeReader } from '@zxing/library';

const QRScanner = () => {
  const [result, setResult] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false); // State to track mobile device
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    const checkMobileDevice = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
    };

    checkMobileDevice(); // Check if the device is mobile on component mount
  }, []);

  const initializeScanner = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: isMobileDevice ? { exact: 'environment' } : 'user' // Use rear camera on mobile devices
        } 
      });
      videoRef.current.srcObject = videoStream;
      codeReader.current = new BrowserBarcodeReader();
      scanBarcode(); // Start scanning process
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert("You currently have another app or window open that is accessing your camera. Please close said window or app and refresh the page to use the scanner.");
    }
  };

  useEffect(() => {
    initializeScanner();

    return () => {
      if (videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isMobileDevice]); // Re-initialize scanner when device type changes

  const scanBarcode = async () => {
    try {
      codeReader.current = new BrowserBarcodeReader();
      const newResult = await codeReader.current.decodeFromVideoElement(videoRef.current);
      setResult(newResult.text);
      setShowModal(true); // Show modal when barcode is detected
      videoRef.current.pause(); // Pause the video after scanning a barcode
    } catch (error) {
      console.error('Barcode scanning error:', error);
      // If scanning fails, try again after a short delay
      setTimeout(scanBarcode, 1000);
    }
  };

  const handleRescan = () => {
    setResult('');
    setShowModal(false);
    // Reinitialize the scanner with the updated video stream
    initializeScanner();
  };

  const handleContinue = () => {
    // Implement continue functionality here
  };

  return (
    <div>
      <video ref={videoRef} className="video" autoPlay></video>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Scanned Barcode</h3>
            <p>{result}</p>
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

export default QRScanner;
