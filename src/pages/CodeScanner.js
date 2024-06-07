import { useState, useEffect} from "react";
import { useZxing } from "react-zxing";
import { useRouter } from 'next/router';
import { useMediaDevices } from "react-media-devices";
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
  const constraints = {
    video: true
  };
  
  const { devices } = useMediaDevices(constraints);
  const deviceId = devices?.[3]?.deviceId;

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
    deviceId: deviceId,
    // constraints: {
    //   facingMode: "environment",
    //   audio: false
    // },
    
    onError(error) {
      console.error(error);
      document.getElementById('error').innerHTML = `${error}`;
      setEOToggled(true);
    }
  });
  
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
  
  function openSettingsOverlay() {
    const videoElement = document.getElementById('video');
    videoElement.pause();
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
    const videoElement = document.getElementById('video');
    videoElement.play();
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
    window.location.reload()
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
          <button className={styles.overlayButton} onClick={closeSettingsOverlay}><i className="fa fa-close"/></button>
          <div id="sourceSelectOption" className={styles.settingsOption} style={{ display: 'none' }}>
            <p htmlFor="sourceSelect" title='Choose from available camera sources to change the video input device.' className={styles.settingLabel}>Camera Source</p>
            <select id="sourceSelect" style={{ maxWidth: '400px' }} />
          </div>
          <div className={styles.settingsOption}>
            <p title='Flip the video horizontally.' className={styles.settingLabel}>Mirror Video</p>
            <ToggleSwitch round onChange={toggleMirroredVideo} />
          </div>
          <div id='aspectRatioSetting' className={styles.settingsOption}>
            <p title='Fit the entire camera source to the screen.' className={styles.settingLabel}>Fit to Screen</p>
            <ToggleSwitch round onChange={toggleAspectRatio} />
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
            <button id="rescanButton" onClick={reloadPage}>Refresh</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};