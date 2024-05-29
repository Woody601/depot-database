import { useEffect, useState, useRef } from 'react';
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
      const videoElement = document.getElementById('video');
      const toggleSettingsElement = document.getElementById('settingsBtn');
      const aspectRatioSetting = document.getElementById('aspectRatioSetting');
      if (videoElement && toggleSettingsElement) {
        const videoWidth = videoElement.getBoundingClientRect().width;
        if (window.innerWidth < videoWidth) {
          toggleSettingsElement.style.right = '0'; // Apply the style when window width is less than video width
          // Add other styles as needed
          aspectRatioSetting.style.display = 'flex'; 
        } else {
          toggleSettingsElement.style.right = 'unset'; // Reset to default
          // Reset other styles as needed
          if (window.innerWidth === videoWidth) {
            aspectRatioSetting.style.display = 'flex';
          } else {
            aspectRatioSetting.style.display = 'none';
          }
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
    const handleResize = () => {
      const videoElement = document.getElementById('video');
      const toggleSettingsElement = document.getElementById('settingsBtn');

      if (videoElement && toggleSettingsElement) {
        const videoWidth = videoElement.getBoundingClientRect().width;
        if (window.innerWidth < videoWidth) {
          toggleSettingsElement.style.right = '0'; // Apply the style when window width is less than video width
          // Add other styles as needed
        } else {
          toggleSettingsElement.style.right = 'unset'; // Reset to default
          // Reset other styles as needed
        }
      }
    };

    handleResize(); // Initial call

  }, [libraryLoaded]); // This useEffect will rerun when libraryLoaded changes

  function initializeScanner() {
    const codeReader = new ZXing.BrowserQRCodeReader();
    codeReader.getVideoInputDevices()
      .then((videoInputDevices) => {
        const sourceSelect = document.getElementById('sourceSelect');
        
        if (videoInputDevices.length > 0) {
          setSelectedDeviceId(videoInputDevices[0].deviceId);
          videoInputDevices.forEach((device) => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label;
            sourceSelect.appendChild(option);
          });
          sourceSelect.onchange = (event) => {
            setSelectedDeviceId(event.target.value);
          };
          
        }
        if (videoInputDevices.length == 1) {
          document.getElementById('sourceSelectOption').style.display = 'none';
          setSelectedDeviceId(videoInputDevices[0].deviceId);
        }
        document.getElementById('rescanButton').addEventListener('click', () => {
          rescan(codeReader, selectedDeviceId);
          console.log('Rescanning...');
        });
        // Start decoding once the component mounts
        scanQRCode(codeReader);
      })
      .catch((err) => {
        console.error(err);
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
        if (err && !(err instanceof ZXing.NotFoundException)) {
          console.error(err);
          document.getElementById('result').textContent = err;
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

  function toggleAspectRatio() {
    const videoElement = webcamRef.current.video;
    const toggleSettingsElement = document.getElementById('settingsBtn');
    if (videoElement.style.width === '100%') {
      videoElement.style.width = 'auto';
      if (videoElement && toggleSettingsElement) {
        if (window.innerWidth < videoElement.offsetWidth) {
          toggleSettingsElement.style.right = '0'; // Example style
          // Add other styles as needed
        } else {
          toggleSettingsElement.style.right = 'unset'; // Reset to default
          // Reset other styles as needed
        }
      }
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
        videoConstraints={{facingMode: {exact: 'environment'} }} 
      />
      <button id="settingsBtn" className={styles.toggleSettings} onClick={toggleSettingsOverlay}><i className="fa fa-gear"></i></button>
      <div className={isSOToggled ? "overlay active" : "overlay"}>
        <div className={styles.overlayContent}>
          <button className={styles.overlayButton} onClick={closeSettingsOverlay}><i className="fa fa-close"></i></button>
          <div id="sourceSelectOption" className={styles.settingsOption}>
            <label htmlFor="sourceSelect" title='Choose from available camera sources to change the video input device.' className={styles.settingLabel}>Camera Source</label>
            <select id="sourceSelect" style={{ maxWidth: '400px' }} />
          </div>
          <div id='aspectRatioSetting' className={styles.settingsOption}>
            <label title='Set the camera to its original size.' className={styles.settingLabel}>Original Aspect Ratio</label>
            <ToggleSwitch round onChange={toggleAspectRatio} />
          </div>
          <div id='mirrorSetting' className={styles.settingsOption}>
            <label title='Flip the video horizontally to create a mirrored effect.' className={styles.settingLabel}>Mirror Video</label>
            <ToggleSwitch round onChange={toggleMirroredVideo} />
          </div>
        </div>
      </div>
      <div id="resultsOverlay" className={isROToggled ? "overlay active" : "overlay"}>
        <div className={styles.overlayContent}>
          <h3>Result:</h3>
          <pre><code id="result" /></pre>
          <div className={styles.overlayButtons}>
            <button id="rescanButton" onClick={toggleResultsOverlay}>Rescan</button>
            <button onClick={toggleResultsOverlay}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
}
