import React, { useState, useEffect, useRef } from 'react';
import { BrowserBarcodeReader } from '@zxing/library';

const QRScanner = () => {
  const [result, setResult] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false); // State to track mobile device
  const [facingMode, setFacingMode] = useState('environment'); // State to track camera facing mode
  const [videoConstraints, setVideoConstraints] = useState({}); // State to track video constraints
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    const checkMobileDevice = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobileDevice(isMobile);
    };

    checkMobileDevice(); // Check if the device is mobile on component mount
  }, []);

  const getSupportedVideoConstraints = async () => {
    try {
      const supportedConstraints = await navigator.mediaDevices.getSupportedConstraints();
      return supportedConstraints;
    } catch (error) {
      console.error('Error getting supported video constraints:', error);
      return {};
    }
  };

  const initializeScanner = async () => {
    try {
      const supportedConstraints = await getSupportedVideoConstraints();
      const constraints = {
        facingMode: isMobileDevice ? facingMode : 'user',
        ...videoConstraints, // Include additional video constraints
      };

      const videoStream = await navigator.mediaDevices.getUserMedia({ video: constraints });
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
  }, [isMobileDevice, facingMode, videoConstraints]); // Re-initialize scanner when device type, facing mode, or video constraints change

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
      setTimeout(scanBarcode, 0);
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

  const toggleCamera = () => {
    setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user')); // Toggle between front and rear cameras
  };

  const handleQualityChange = (event) => {
    const { name, value } = event.target;
    setVideoConstraints(prevConstraints => ({
      ...prevConstraints,
      [name]: value,
    }));
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
      {isMobileDevice && (
        <div>
          <button onClick={toggleCamera}>Toggle Camera</button>
          <label>
            Resolution:
            <select name="width" onChange={handleQualityChange}>
              <option value="640">640p</option>
              <option value="1280">720p</option>
              <option value="1920">1080p</option>
            </select>
          </label>
          <label>
            Frame Rate:
            <select name="frameRate" onChange={handleQualityChange}>
              <option value="30">30fps</option>
              <option value="60">60fps</option>
            </select>
          </label>
          {/* Add more quality settings as needed */}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
