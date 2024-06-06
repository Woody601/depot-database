import React, { useState, useEffect, useCallback } from "react";
import Head from 'next/head';
import styles from "@/styles/WebcamSelector.module.css";

export default function WebcamSelector() {
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const handleDevices = useCallback(
    (mediaDevices) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  useEffect(() => {
    if (selectedDeviceId) {
      navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedDeviceId }, audio: false })
        .then((stream) => {
          const videoElement = document.getElementById('video');
          if (videoElement) {
            videoElement.srcObject = stream;
          }
        })
        .catch((error) => console.error('Error accessing media devices: ', error));
    }
  }, [selectedDeviceId]);

  return (
    <>
      <Head>
        <title>Webcam Selector</title>
      </Head>
      <div className={styles.container}>
        <h1>Select a Webcam</h1>
        <div className={styles.deviceList}>
          <select
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className={styles.deviceDropdown}
          >
            <option value="">Select a device</option>
            {devices.map((device, key) => (
              <option key={key} value={device.deviceId}>
                {device.label || `Device ${key + 1}`}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.videoContainer}>
          <video id="video" className={styles.video} autoPlay playsInline />
        </div>
      </div>
    </>
  );
}
