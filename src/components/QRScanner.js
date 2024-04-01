// components/QRScanner.js

import React, { useState } from 'react';
import { BrowserBarcodeReader } from '@zxing/library';

const QRScanner = () => {
  const [result, setResult] = useState('');
  const codeReader = new BrowserBarcodeReader();

  const scanBarcode = async () => {
    try {
      const result = await codeReader.decodeFromInputVideoDevice(undefined, 'video');
      setResult(result.text);
    } catch (error) {
      console.error('Barcode scanning error:', error);
    }
  };

  return (
    <div>
      <h2>Barcode and QR Code Scanner</h2>
      <video id="video" width="300" height="200"></video>
      <button onClick={scanBarcode}>Scan</button>
      <p>{result}</p>
    </div>
  );
};

export default QRScanner;