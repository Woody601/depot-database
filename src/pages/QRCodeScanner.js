import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script'; // Import next/script
import ToggleSwitch from "@/components/ToggleSwitch";
import styles from "@/styles/QRCodeScanner.module.css";

export default function QRCodeScanner() {
  const [libraryLoaded, setLibraryLoaded] = useState(false);

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
      if (videoElement && toggleSettingsElement) {
        if (window.innerWidth < videoElement.offsetWidth) {
          toggleSettingsElement.style.right = '0'; // Example style
          // Add other styles as needed
        } else {
          toggleSettingsElement.style.right = 'unset'; // Reset to default
          // Reset other styles as needed
        }
      }
    };
  
    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially to set the correct style on load
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function initializeScanner() {
    let selectedDeviceId;
    const codeReader = new ZXing.BrowserQRCodeReader();

    codeReader.getVideoInputDevices()
      .then((videoInputDevices) => {
        const sourceSelect = document.getElementById('sourceSelect');
        selectedDeviceId = videoInputDevices[0].deviceId;
        if (videoInputDevices.length >= 1) {
          videoInputDevices.forEach((element) => {
            // Check if an option with the same label already exists
            const existingOption = Array.from(sourceSelect.options).find(option => option.text === element.label);
            if (!existingOption) {
              const sourceOption = document.createElement('option');
              sourceOption.text = element.label;
              console.log(element.label);
              console.log(element.deviceId);
              sourceOption.value = element.deviceId;
              sourceSelect.appendChild(sourceOption);
            }
          });

          sourceSelect.onchange = (event) => {
            selectedDeviceId = event.target.value;
            changeVideoSource(selectedDeviceId); // Automatically change video source
          };
        }
        if (videoInputDevices.length == 1) {
          document.getElementById('sourceSelectOption').style.display = 'none';
          selectedDeviceId = videoInputDevices[0].deviceId;
        }
        document.getElementById('rescanButton').addEventListener('click', () => {
          rescan(codeReader, selectedDeviceId);
          console.log('Rescanning...');
        });
        // Start decoding once the component mounts
        scanQRCode(codeReader, selectedDeviceId);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function changeVideoSource(deviceId) {
    const videoElement = document.getElementById('video');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } } })
        .then((stream) => {
          videoElement.srcObject = stream;
          videoElement.play(); // Start playing the video with the new source
        })
        .catch((err) => {
          console.error('Error accessing media devices: ', err);
        });
    } else {
      console.error('getUserMedia is not supported');
    }
    toggleSettingsOverlay();
  }

  function scanQRCode(codeReader, selectedDeviceId) {
    const videoElement = document.getElementById('video');
    codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video').then((result) => {
      console.log(result);
      document.getElementById('result').textContent = result.text;
      const overlay = document.getElementById('overlay');
      overlay.style.display = 'flex';
     
      // Check if the result is a link
      const isLink = result.text.startsWith('http://') || result.text.startsWith('https://');
      // Update the result element to show the result as a link if it is a link
      document.getElementById('result').innerHTML = isLink ? `<a href="${result.text}" target="_blank">${result.text}</a>` : result.text;
      // Pause the video
      videoElement.pause();
    }).catch((err) => {
      console.error(err);
      document.getElementById('result').textContent = err;
    });
  }

  function rescan(codeReader, selectedDeviceId) {
    resetScanner(codeReader);
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
    scanQRCode(codeReader, selectedDeviceId);
  }

  function resetScanner(codeReader) {
    codeReader.reset();
    document.getElementById('result').textContent = '';
  }

  function toggleSettingsOverlay() {
    const overlaySettings = document.getElementById('overlay-settings');
    if (overlaySettings.style.display === 'none' || overlaySettings.style.display === '') {
      overlaySettings.style.display = 'flex';
    } else {
      overlaySettings.style.display = 'none';
    }
  }

  function toggleAspectRatio() {
    const videoElement = document.getElementById('video');
    const toggleSettingsElement = document.getElementById('settingsBtn');
    if (videoElement.style.width === '100%') {
      videoElement.style.width = 'auto'; // Set width to 100%
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


  return (
    <div className={styles.videoContainer}>
      <Head>
        <title>QR Code Scanner</title>
      </Head>
      <Script
        src="https://unpkg.com/@zxing/library@latest"
        onLoad={() => window.onZXingLoaded()} // Call the callback when the library is loaded
      />
      <video id="video" className={styles.video}/>
      <button id="settingsBtn" className={styles.toggleSettings} onClick={toggleSettingsOverlay}><i className="fa fa-gear"></i></button>
      {/* Overlay with buttons */}
      <div id="overlay-settings" className={styles.overlay}>
        <div className={styles.overlayContent}>
        <button className={styles.overlayButton} onClick={toggleSettingsOverlay}><i className="fa fa-close"></i></button>
        <div id="sourceSelectOption"className={styles.settingsOption}>
              <label htmlFor="sourceSelect" title='Choose from available camera sources to change the video input device.' className={styles.settingLabel}>Camera Source</label>
              <select id="sourceSelect" style={{ maxWidth: '400px' }} />
              </div>
              <div className={styles.settingsOption}>
              <label title='Set the camera to its original size.' className={styles.settingLabel}>Original Aspect Ratio</label>
              <ToggleSwitch round onChange={toggleAspectRatio} />
              </div>
        </div>
      </div>
      {/* Overlay with buttons */}
      <div id="overlay" className={styles.overlay}>
        <div className={styles.overlayContent}>
          <h3>Result:</h3>
          <pre><code id="result" /></pre>
          <div className={styles.overlayButtons}>
            <button id="rescanButton">Rescan</button>
            <button onClick={() => { document.getElementById('overlay').style.display = 'none'; }}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
};