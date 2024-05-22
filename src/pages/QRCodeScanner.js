import { useEffect, useState } from 'react';
import Head from 'next/head';
import Script from 'next/script'; // Import next/script
import ToggleSwitch from "@/components/ToggleSwitch";
import styles from "@/styles/QRCodeScanner.module.css";

export default function QRCodeScanner() {
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  // SO = Settings Overlay
  const [isSOToggled, setSOToggled] = useState(false);
  // RO = Results Overlay
  const [isROToggled, setROToggled] = useState(false);
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
          aspectRatioSetting.style.display = 'flex'; // 
        } else {
          toggleSettingsElement.style.right = 'unset'; // Reset to default
          // Reset other styles as needed
          if (window.innerWidth == videoWidth) {
            aspectRatioSetting.style.display = 'flex ';
          }
          else {
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
    // Additional call to handleResize after initial load and another call after a short delay
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
    let selectedDeviceId;
    const codeReader = new ZXing.BrowserQRCodeReader();

    codeReader.getVideoInputDevices()
      .then((videoInputDevices) => {
        const sourceSelect = document.getElementById('sourceSelect');
        selectedDeviceId = videoInputDevices[0].deviceId;
        if (videoInputDevices.length >= 1) {
          videoInputDevices.forEach((element) => {
            const sourceOption = document.createElement('option');
              sourceOption.text = element.label;
              console.log(element.label);
              console.log(element.deviceId);
              sourceOption.value = element.deviceId;
              sourceSelect.appendChild(sourceOption);
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
  }

  function scanQRCode(codeReader, selectedDeviceId) {
    const videoElement = document.getElementById('video');
    codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video').then((result) => {
      console.log(result);
      document.getElementById('result').textContent = result.text;
      setROToggled(!isROToggled);
     
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
    setTimeout(() => {
      resetScanner(codeReader);
    }, 400);
    scanQRCode(codeReader, selectedDeviceId);
  }

  function resetScanner(codeReader) {
    codeReader.reset();
    document.getElementById('result').textContent = '';
  }

  function toggleSettingsOverlay() {
    setSOToggled(!isSOToggled);    
  }

  function toggleResultsOverlay() {
    setROToggled(!isROToggled);    
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
function toggleMirroredVideo() {
  const videoElement = document.getElementById('video');
  if (videoElement.style.transform === 'scaleX(-1)') {
    videoElement.style.transform = 'scaleX(1)';
  } else {
    videoElement.style.transform = 'scaleX(-1)';
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
      <div className={isSOToggled ? "overlay active" : "overlay"}>
        <div className={styles.overlayContent}>
        <button className={styles.overlayButton} onClick={toggleSettingsOverlay}><i className="fa fa-close"></i></button>
        <div id="sourceSelectOption"className={styles.settingsOption}>
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
      {/* Overlay with buttons */}
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
};