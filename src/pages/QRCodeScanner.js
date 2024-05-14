  import { useEffect, useState } from 'react';
  import Head from 'next/head';
  import Script from 'next/script'; // Import next/script
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

    function initializeScanner() {
      let selectedDeviceId;
      const codeReader = new ZXing.BrowserQRCodeReader();
    
      codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
          const sourceSelect = document.getElementById('sourceSelect');
          let facingBackDeviceAdded = false;
          let facingFrontDeviceAdded = false;
    
          videoInputDevices.forEach((element) => {
            // Check if an option with the same label already exists
            const existingOption = Array.from(sourceSelect.options).find(option => option.text === element.label);
            
            // Check if the device is a video input device and if it's already added to the dropdown
            if (element.kind === 'videoinput' && !existingOption) {
              // Check the facing mode of the device and add it to the dropdown accordingly
              if (element.facingMode === 'environment' && !facingBackDeviceAdded) {
                const sourceOption = document.createElement('option');
                sourceOption.text = element.label;
                sourceOption.value = element.deviceId;
                sourceSelect.appendChild(sourceOption);
                facingBackDeviceAdded = true;
              } else if (element.facingMode === 'user' && !facingFrontDeviceAdded) {
                const sourceOption = document.createElement('option');
                sourceOption.text = element.label;
                sourceOption.value = element.deviceId;
                sourceSelect.appendChild(sourceOption);
                facingFrontDeviceAdded = true;
              }
            }
          });
    
          sourceSelect.onchange = (event) => {
            selectedDeviceId = event.target.value;
            changeVideoSource(selectedDeviceId); // Automatically change video source
          };
    
          const sourceSelectPanel = document.getElementById('sourceSelectPanel');
          sourceSelectPanel.style.display = 'block';
        })
        .catch((err) => {
          console.error(err);
        });
    
      document.getElementById('rescanButton').addEventListener('click', () => {
        rescan(codeReader, selectedDeviceId);
        console.log('Rescanning...');
      });
      // Start decoding once the component mounts
      decodeOnce(codeReader, selectedDeviceId);
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

    function decodeOnce(codeReader, selectedDeviceId) {
      const videoElement = document.getElementById('video');
      codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video').then((result) => {
        console.log(result);
        document.getElementById('result').textContent = result.text;
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'flex';
    
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
      decodeOnce(codeReader, selectedDeviceId);
    }

    function resetScanner(codeReader) {
      codeReader.reset();
      document.getElementById('result').textContent = '';
    }

    return (
      <div>
        <Head>
          <title>ZXing TypeScript | Decoding from camera stream</title>
          
        </Head>
        <Script
          src="https://unpkg.com/@zxing/library@latest"
          onLoad={() => window.onZXingLoaded()} // Call the callback when the library is loaded
        />
        <video id="video" className={styles.video}/>
        <main className="wrapper">
          <section className="container" id="demo-content">
              
            <div id="sourceSelectPanel" style={{ display: 'none' }}>
              <label htmlFor="sourceSelect">Change video source:</label>
              <select id="sourceSelect" style={{ maxWidth: '400px' }} />
            </div>
          </section>
        </main>
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
