import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import Webcam from 'react-webcam'; // Import react-webcam
import ToggleSwitch from "@/components/ToggleSwitch";
import styles from "@/styles/QRCodeScanner.module.css";

export default function QRCodeScanner() {
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  // SO = Settings Overlay
  const [isSOToggled, setSOToggled] = useState(false);
  // RO = Results Overlay
  const [isROToggled, setROToggled] = useState(false);
  const webcamRef = useRef(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [isVideoMirrored, setVideoMirrored] = useState(false);
  const [result, setResult] = useState('');
  const router = useRouter();
  const codeReaderRef = useRef(null); // Add this line\

  useEffect(() => {
    // Set up a flag to indicate when the library is loaded
    const libraryLoadCallback = () => {
      setLibraryLoaded(true);
    };

    // Attach the callback to the window object
    window.onZXingLoaded = libraryLoadCallback;

    return () => {
      window.onZXingLoaded = null; // Clean up the callback when unmounting
    };
  }, []);

  useEffect(() => {
    if (libraryLoaded) {
      // If the library is loaded, initialize the scanner
      initializeScanner();
    }
  }, [libraryLoaded]);
  useEffect(() => {
  // Reset libraryLoaded state
  setLibraryLoaded(false);

  // Load ZXing library script again
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@zxing/library@latest';
  script.onload = () => {
    setLibraryLoaded(true);
  };
  document.body.appendChild(script);

  const handleRouteChange = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset(); // Stop the ZXing scanner
    }
    if (webcamRef.current && webcamRef.current.stream) {
      webcamRef.current.stream.getTracks().forEach(track => track.stop()); // Stop the video stream
    }
  };

  router.events.on('routeChangeStart', handleRouteChange);

  return () => {
    router.events.off('routeChangeStart', handleRouteChange);
  };
}, [router]);

  useEffect(() => {
    const handleResize = () => {
      const aspectRatioSetting = document.getElementById('aspectRatioSetting');
      const videoWidth = document.getElementById('video').getBoundingClientRect().width;
      const targetElement = document.getElementById('controls');
      targetElement.style.width = `${videoWidth}px`;

        if (window.innerWidth < videoWidth) {
          aspectRatioSetting.style.display = 'flex'; 
        } else {
          if (window.innerWidth == videoWidth) {
            aspectRatioSetting.style.display = 'flex';
          } else {
            aspectRatioSetting.style.display = 'none';
          }
        }
    };

    window.addEventListener('resize', handleResize);

    const videoElement = document.getElementById('video');
    if (videoElement) {
      videoElement.addEventListener('loadedmetadata', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (videoElement) {
        videoElement.removeEventListener('loadedmetadata', handleResize);
      }
    };
  }, []);
  useEffect(() => {
    const handleRouteChange = () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset(); // Stop the ZXing scanner
      }
      if (webcamRef.current && webcamRef.current.stream) {
        webcamRef.current.stream.getTracks().forEach(track => track.stop()); // Stop the video stream
      }
    };
  
    router.events.on('routeChangeStart', handleRouteChange);
  
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);
  
  function initializeScanner() {
    const codeReader = new ZXing.BrowserQRCodeReader();
    codeReaderRef.current = codeReader;
    scanQRCode(codeReader);
    document.getElementById('rescanButton').addEventListener('click', () => {
      codeReader.reset();
      setTimeout(() => {
        scanQRCode(codeReader);
      }, 400);
    });
  }
  
  function scanQRCode(codeReader) {
    if (webcamRef.current) {
      const videoElement = webcamRef.current.video;
      document.getElementById('result').textContent = '';
      codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement, (result, err) => {
        if (result) {
          document.getElementById('result').textContent = result.text;
          const isLink = result.text.startsWith('http://') || result.text.startsWith('https://');
          document.getElementById('result').innerHTML = isLink ? `<a href="${result.text}" target="_blank">${result.text}</a>` : result.text;
          // Sets the Settings Overlay to False, if it is open.
          setSOToggled(false);
          // Opens the Results Overlay to show the Result.
          setROToggled(true);
          videoElement.pause();
        }
      });
    }
  }

  function rescan(codeReader) {
    
  }

  function openSettingsOverlay() {
    webcamRef.current.video.pause();
    setSOToggled(true);
  }

  function closeSettingsOverlay() {
    setSOToggled(false);
    webcamRef.current.video.play();
  }

  function closeResultsOverlay() {
    setROToggled(false);
  }

  function toggleAspectRatio() {
    const videoElement = webcamRef.current.video;
    if (videoElement.style.width == '100%') {
      videoElement.style.width = 'auto';
    } else {
      videoElement.style.width = '100%'; // Reset width to auto
    }
  }

  function toggleMirroredVideo() {
    if (isVideoMirrored == false) {
      setVideoMirrored(true);
    }
    else {
      setVideoMirrored(false);
    }
  }
  function continueButtonClicked(resultText) {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset(); // Stop the ZXing scanner
    }
    closeResultsOverlay();
    localStorage.setItem('qrCodeResult', resultText);
    setTimeout(() => {
      router.push('/Result');
    }, 400);
  }
  // Function to reset the camera
function resetCamera() {
  if (webcamRef.current && webcamRef.current.stream) {
    webcamRef.current.stream.getTracks().forEach(track => track.stop()); // Stop the current video stream
  }
  if (webcamRef.current) {
    webcamRef.current.video.srcObject = null; // Clear the video element's source
  }
  // Reinitialize the webcam
  const videoConstraints = {
    facingMode: "environment"
  };
  if (webcamRef.current) {
    webcamRef.current.video.srcObject = null;
    navigator.mediaDevices.getUserMedia({ video: videoConstraints }).then(stream => {
      webcamRef.current.video.srcObject = stream;
      webcamRef.current.stream = stream;
      if (isSOToggled == true) {
        setTimeout(() => {
          webcamRef.current.video.pause();
        }, 50);
      }
    }).catch(err => {
      console.error("Error reinitializing webcam:", err);
    });
  }
}

  return (
    <>
    <Head>
        <title>QR Code Scanner</title>
      </Head>
      <Script
        src="https://unpkg.com/@zxing/library@latest"
        onLoad={() => setLibraryLoaded(true)}
      />
    <div className={styles.videoContainer}>
      <Webcam 
  id="video" 
  className={styles.video} 
  ref={webcamRef} 
  mirrored={isVideoMirrored}
  forceScreenshotSourceSize={true}
  videoConstraints={{
    facingMode: "environment"
  }}

/>
      <div id='controls' className={styles.controls}>
        <button id="settingsBtn" className={styles.toggleSettings} onClick={openSettingsOverlay} title='Settings'><i className="fa fa-gear"/></button>
      </div>
      <div className={isSOToggled ? "overlay active" : "overlay"}>
        <div className={styles.overlayContent}>
          <button className={styles.overlayButton} onClick={closeSettingsOverlay}><i className="fa fa-close"/></button>
          <div id="sourceSelectOption" className={styles.settingsOption} style={{ display: 'none' }}>
            <p htmlFor="sourceSelect" title='Choose from available camera sources to change the video input device.' className={styles.settingLabel}>Camera Source</p>
            <select id="sourceSelect" style={{ maxWidth: '400px' }} />
          </div>
          <div id='mirrorSetting' className={styles.settingsOption}>
            <p title='Flip the video horizontally to create a mirrored effect.' className={styles.settingLabel}>Mirror Video</p>
            <ToggleSwitch round onChange={toggleMirroredVideo} />
          </div>
          <div id='aspectRatioSetting' className={styles.settingsOption}>
            <p title='Set the camera to its original size.' className={styles.settingLabel}>Original Aspect Ratio</p>
            <ToggleSwitch round onChange={toggleAspectRatio} />
          </div>
          <div id='resetCamSetting' className={styles.settingsOption}>
            <button onClick={resetCamera} title='Reset the camera, if there are issues with it.'>Reset Camera</button>
          </div>
        </div>
      </div>
      <div id="resultsOverlay" className={isROToggled ? "overlay active" : "overlay"}>
        <div className={styles.overlayContent}>
          <h3>Result:</h3>
          <pre><code id="result" /></pre>
          <div className={styles.overlayButtons}>
            <button id="rescanButton" onClick={closeResultsOverlay}>Rescan</button>
            <button onClick={() => continueButtonClicked(document.getElementById('result').textContent)}>Continue</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}