import { useState, useEffect} from "react";
import { useZxing } from "react-zxing";
import { useRouter } from 'next/router';
import { toggleFullScreen, hideNavBar } from "@/components/Functions";
import Button from "@/components/Button";
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
  const [isMirrored, setIsMirrored] = useState(false);
  const [isVideoPaused, setVideoPaused] = useState(false);
  const router = useRouter();
  const [cameras, setCameras] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [isBackCamera, setIsBackCamera] = useState(true);
  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
      const isLink = result.text.startsWith('http://') || result.text.startsWith('https://');
          document.getElementById('result').innerHTML = isLink ? `<a href="${window.innerHeight}" target="_blank">${window.innerHeight}</a>` : window.innerHeight;
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
    setIsMirrored((prevState) => {
      const newState = !prevState;
      videoElement.style.transform = newState ? "scaleX(-1)" : "scaleX(1)";
      return newState;
    });
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
    const selectedCamera = cameras.find(camera => camera.deviceId === deviceId);
    const isBack = selectedCamera?.label.toLowerCase().includes('back');
    setIsBackCamera(isBack);
    setSelectedDeviceId(deviceId);
    localStorage.setItem("selectedDeviceId", deviceId);
    const videoElement = document.getElementById('video');
  if (isBack && isMirrored) {
    videoElement.style.transform = "scaleX(1)";
    setIsMirrored(false);
  }


  }
  return (
    <>
    <Head>
        <title>Code Scanner</title>
      </Head>
    <div className={styles.videoContainer}>
<video id="video" className={styles.video} ref={ref} />
<div id='controls' className={isVideoPaused ? styles.controls + ' ' + styles.none : styles.controls}>
        <Button id="settingsBtn" icon='gear' onClick={openSettingsOverlay} title='Settings'/>
      </div>
      <div className={isSOToggled ? "overlay active" : "overlay"}>
        <div className={styles.overlayContent}>
        <div className={styles.settingsControls}>
        <Button icon='close' onClick={closeSettingsOverlay} title='Close button component'/>
        <Button icon='expand' onClick={toggleFullScreen} title='Full screen button component'/>
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
            {!isBackCamera && (
              <div className={styles.settingsOption}>
              <p title='Flip the video horizontally.' className={styles.settingLabel}>Mirror Video</p>
              <ToggleSwitch round onChange={toggleMirroredVideo} />
            </div>
            )}
          
          <div id='aspectRatioSetting' className={styles.settingsOption}>
            <p title='Fit the entire camera source to the screen.' className={styles.settingLabel}>Fit to Screen</p>
            <ToggleSwitch round onChange={toggleAspectRatio} />
          </div>
          <div className={styles.settingsOption}>
            <p title='Fit the entire camera source to the screen.' className={styles.settingLabel}>Hide Navbar</p>
            <ToggleSwitch round /*onChange={hideNavBar}*//>
          </div>
          
          <div id='resetCamSetting' className={styles.settingsOption}>
            <Button onClick={reloadPage} title='Reset the camera, if there are issues with it.'>Reset Camera</Button>
          </div>
        </div>
      </div>
          <div id="resultsOverlay" className={isROToggled ? "overlay active" : "overlay"}>
        <div className={styles.overlayContent}>
          <h3>Result:</h3>
          <pre><code id="result" /></pre>
          <div className={styles.overlayButtons}>
            <Button id="rescanButton" onClick={closeResultsOverlay}>Rescan</Button>
            <Button onClick={() => continueButtonClicked(result)}>Continue</Button>
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