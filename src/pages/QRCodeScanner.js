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
    const handleResize = () => {
      const aspectRatioSetting = document.getElementById('aspectRatioSetting');
      const videoWidth = document.getElementById('video').getBoundingClientRect().width;
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

  function initializeScanner() {
    const codeReader = new ZXing.BrowserQRCodeReader();
    codeReader.getVideoInputDevices()
      .then((videoInputDevices) => {
        const sourceSelectElement = document.getElementById('sourceSelectOption');
        const switchCamBtnElement = document.getElementById('switchCamDir');
        // if (videoInputDevices.length == 1) {
        //   sourceSelectElement.style.display = 'none';
        // }
        sourceSelectElement.style.display = 'none';
        // Start decoding once the component mounts
        scanQRCode(codeReader);
      })
      .catch((err) => {
        console.error(err);
      });
  
    document.getElementById('rescanButton').addEventListener('click', () => {
      rescan(codeReader);
    });
  }  

  function scanQRCode(codeReader) {
    if (webcamRef.current) {
      const videoElement = webcamRef.current.video;
      codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement, (result, err) => {
        if (result) {
          console.log(result);
          document.getElementById('result').textContent = result.text;
          setROToggled(true);
          setSOToggled(false);
          const isLink = result.text.startsWith('http://') || result.text.startsWith('https://');
          document.getElementById('result').innerHTML = isLink ? `<a href="${result.text}" target="_blank">${result.text}</a>` : result.text;
          videoElement.pause();
        }
        
      });
    }
  }



  function rescan(codeReader) {
    codeReader.reset();
    setTimeout(() => {
      document.getElementById('result').textContent = '';
      scanQRCode(codeReader);
    }, 400);
  }

  function toggleSettingsOverlay() {
    setSOToggled(!isSOToggled);
  }

  function closeSettingsOverlay() {
    setSOToggled(false);
  }

  function toggleResultsOverlay() {
    setROToggled(!isROToggled);
  }
  function closeResultsOverlay() {
    setROToggled(false);
  }

  function toggleAspectRatio() {
    const videoElement = webcamRef.current.video;
    if (videoElement.style.width === '100%') {
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
    // Store the result in localStorage
    closeResultsOverlay();
    setTimeout(() => {
      localStorage.setItem('qrCodeResult', resultText);
    // Navigate to another page
    router.push('/Result');
    }, 400);
  }


  return (
    <div className={styles.videoContainer}>
      <Head>
        <title>QR Code Scanner</title>
      </Head>
      <Script
        src="https://unpkg.com/@zxing/library@latest"
        onLoad={() => setLibraryLoaded(true)}
      />
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
      <div className={styles.controls}>
        <button id="settingsBtn" className={styles.toggleSettings} onClick={toggleSettingsOverlay} title='Settings'><i className="fa fa-gear"/></button>
      </div>
      <div className={isSOToggled ? "overlay active" : "overlay"}>
        <div className={styles.overlayContent}>
          <button className={styles.overlayButton} onClick={closeSettingsOverlay}><i className="fa fa-close"></i></button>
          <div id="sourceSelectOption" className={styles.settingsOption}>
            <label htmlFor="sourceSelect" title='Choose from available camera sources to change the video input device.' className={styles.settingLabel}>Camera Source</label>
            <select id="sourceSelect" style={{ maxWidth: '400px' }} />
          </div>
          <div id='mirrorSetting' className={styles.settingsOption}>
            <label title='Flip the video horizontally to create a mirrored effect.' className={styles.settingLabel}>Mirror Video</label>
            <ToggleSwitch round onChange={toggleMirroredVideo} />
          </div>
          <div id='aspectRatioSetting' className={styles.settingsOption}>
            <label title='Set the camera to its original size.' className={styles.settingLabel}>Original Aspect Ratio</label>
            <ToggleSwitch round onChange={toggleAspectRatio} />
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
  );
}