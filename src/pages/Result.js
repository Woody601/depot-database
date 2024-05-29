import { useEffect } from 'react';

export default function Result() {
  useEffect(() => {
    // Retrieve the result from localStorage
    const result = localStorage.getItem('qrCodeResult');
    console.log('QR Code Result:', result);

    // Optionally, clear the result from localStorage after retrieving it
    localStorage.removeItem('qrCodeResult');
  }, []);

  return (
    <div>
      <h1>Result Page</h1>
      <p>Result: {localStorage.getItem('qrCodeResult')}</p>
      {/* Additional content */}
    </div>
  );
}
