import { useState, useEffect} from "react";
import { useZxing } from "react-zxing";
import { useRouter } from 'next/router';
import { toggleFullScreen, hideNavBar } from "@/components/Functions";
import Head from 'next/head';
import styles from "@/styles/CodeScanner.module.css";
import ToggleSwitch from "@/components/ToggleSwitch";
export default function CodeScanner() {
  const [result, setResult] = useState("");
  // SO = Settings Overlay
  const [isSOToggled, setSOToggled] = useState(false);
  // RO = Results Overlay
  const [isROToggled, setROToggled] = useState(false);
  // EO = Error Overlay
  const [isEOToggled, setEOToggled] = useState(false);
  const [isVideoPaused, setVideoPaused] = useState(false);
  const router = useRouter();
  const [cameras, setCameras] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
      const isLink = result.text.startsWith('http://') || result.text.startsWith('https://');
          document.getElementById('result').innerHTML = isLink ? `<a href="${result.text}" target="_blank">${result.text}</a>` : result.text;
      setSOToggled(false);
      setVideoPaused(true);
      setROToggled(true);
    },
    paused: isVideoPaused,
    deviceId: selectedDeviceId,
    // constraints: {
    //   facingMode: "environment",
    //   audio: false
    // },
    
    onError(error) {
      if (error.name != "NotReadableError") {      
      document.getElementById('error').innerHTML = `${error}`;
      setEOToggled(true)
      if (error.name == "NotAllowedError") {
        document.getElementById('error').innerHTML = "Camera permission denied. Please allow camera access in your browser settings and reload the page.";
      }
      }
    }
  });
  
  useEffect(() => {
    const handleResize = () => {
      const aspectRatioSetting = document.getElementById('aspectRatioSetting');
      const videoWidth = document.getElementById('video').getBoundingClientRect().width;
      const controlsElement = document.getElementById('controls');
      controlsElement.style.width = `${videoWidth}px`;
      controlsElement.style.display = 'none';
      if (controlsElement.style.display == 'none' && isVideoPaused == false) {
        controlsElement.style.display = 'flex';
      }

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
  
  function openSettingsOverlay() {
    setSOToggled(true);
  }
  function toggleMirroredVideo() {
    const videoElement = document.getElementById('video');
    videoElement.style.transform = videoElement.style.transform === "scaleX(-1)" ? "scaleX(1)" : "scaleX(-1)";
}

  function toggleAspectRatio() {
    const videoElement = document.getElementById('video');
    videoElement.style.width = videoElement.style.width == '100%' ? 'auto' : '100%';
}

  /**
   * Closes the settings overlay and resumes video playback.
   */
  function closeSettingsOverlay() {
    setSOToggled(false);
  }

  /**
   * Closes the results overlay and resumes video playback.
   */
  function closeResultsOverlay() {
    setROToggled(false);
    setTimeout(() => {
      setVideoPaused(false);
    }, 400) 
  }

  /**
   * Handles the click event of the "Continue" button in the results overlay.
   * Saves the QR code result to local storage and navigates to the "/Result" page.
   *
   * @param {string} resultText - The text content of the scanned QR code.
   */
  function continueButtonClicked(resultText) {
    setROToggled(false)
    localStorage.setItem("qrCodeResult", resultText)
    setTimeout(() => {
      router.push("/Result")
    }, 400)
  }
  //Refreshes the current page by reloading the window.
  function reloadPage() {
    window.location.reload();
  }
  useEffect(() => {
    async function fetchCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind == 'videoinput');
        setCameras(videoDevices);
        let backCamera = videoDevices.find(device => device.label.includes('back') || device.label.includes('Back'));
      if (backCamera) {
        localStorage.setItem("selectedDeviceId", backCamera.deviceId);
        setSelectedDeviceId(backCamera.deviceId);
      }
      } catch (error) {
        console.error('Error enumerating devices:', error);
      }
    }

    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      fetchCameras();
    } else {
      console.error('enumerateDevices() not supported.');
    }
  }, []);
  function changeCamera(deviceId) {
    localStorage.setItem("selectedDeviceId", deviceId);
    setSelectedDeviceId(deviceId);
  }
  return (
    <>
    <Head>
        <title>Code Scanner</title>
      </Head>
    <div className={styles.videoContainer}>
<video id="video" className={styles.video} ref={ref} />
<div id='controls' className={isVideoPaused ? styles.controls + ' ' + styles.none : styles.controls}>
        <button id="settingsBtn" className={styles.toggleSettings} onClick={openSettingsOverlay} title='Settings'><i className="fa fa-gear"/></button>
      </div>
      <div className={isSOToggled ? "overlay active" : "overlay"}>
        <div className={styles.overlayContent}>
        <div className={styles.settingsControls}>
        <button className={styles.overlayButton} onClick={closeSettingsOverlay} title="Close"><i className="fa fa-close"/></button>
        <button className={styles.overlayButton} onClick={toggleFullScreen} title="Full screen"><i className="fa fa-expand"/></button>
        </div>
          
          <div id="sourceSelectOption" className={styles.settingsOption}>
              <p htmlFor="sourceSelect" title='Choose from available camera sources to change the video input device.' className={styles.settingLabel}>Camera Source</p>
              <select id="sourceSelect" value={selectedDeviceId} onChange={(e) => changeCamera(e.target.value)} style={{ maxWidth: '400px' }}>
                {/* {devices && devices
                  .filter(device => device.label) // Filter out devices with blank labels
                  .map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
                  ))} */}
                  {cameras.map((camera) => (
  <option key={camera.deviceId} value={camera.deviceId} >{camera.label.replace(/\([^()]*\)/g, '').trim()}</option>
))}

              </select>
            </div>
          <div className={styles.settingsOption}>
            <p title='Flip the video horizontally.' className={styles.settingLabel}>Mirror Video</p>
            <ToggleSwitch round onChange={toggleMirroredVideo} />
          </div>
          <div id='aspectRatioSetting' className={styles.settingsOption}>
            <p title='Fit the entire camera source to the screen.' className={styles.settingLabel}>Fit to Screen</p>
            <ToggleSwitch round onChange={toggleAspectRatio} />
          </div>
          <div className={styles.settingsOption}>
            <p title='Fit the entire camera source to the screen.' className={styles.settingLabel}>Hide Navbar</p>
            <ToggleSwitch round /*onChange={hideNavBar}*//>
          </div>
          
          <div id='resetCamSetting' className={styles.settingsOption}>
            <button onClick={reloadPage} title='Reset the camera, if there are issues with it.'>Reset Camera</button>
          </div>
        </div>
      </div>
          <div id="resultsOverlay" className={isROToggled ? "overlay active" : "overlay"}>
        <div className={styles.overlayContent}>
          <h3>Result:</h3>
          <pre><code id="result" /></pre>
          <div className={styles.overlayButtons}>
            <button id="rescanButton" onClick={closeResultsOverlay}>Rescan</button>
            <button onClick={() => continueButtonClicked(result)}>Continue</button>
          </div>
        </div>
      </div>
      <div id="errorOverlay" className={isEOToggled ? "overlay active" : "overlay"}>
        <div className={styles.overlayContent}>
          <h3>Error</h3>
          <pre><code id="error" className={styles.errorMSG}/></pre>
          <div className={styles.overlayButtons}>
            <button id="rescanButton" onClick={reloadPage}>Reload</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};