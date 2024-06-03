import { useEffect, useState } from 'react';

export default function Result() {
  const [qrCodeResult, setQrCodeResult] = useState('');

  useEffect(() => {
    const storedResult = localStorage.getItem('qrCodeResult');
    if (storedResult) {
      setQrCodeResult(storedResult);
    }
  }, []);

  return (
    <div>
      <h1>QR Code Result</h1>
      <p>{qrCodeResult}</p>
    </div>
  );
}
