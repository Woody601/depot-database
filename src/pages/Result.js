import { useEffect, useState } from 'react';

export default function Result() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Retrieve the result from localStorage
      const storedResult = localStorage.getItem('qrCodeResult');
      setResult(storedResult);

      // Optionally, clear the result from localStorage after retrieving it
      localStorage.removeItem('qrCodeResult');
    }
  }, []);

  return (
    <div>
      <h3>QR Code Result:</h3>
      <p>{result}</p>
    </div>
  );
}
