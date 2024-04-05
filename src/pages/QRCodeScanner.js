import { useEffect } from 'react';
import Head from 'next/head';

const QRCodeScanner = () => {

  useEffect(() => {
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
            sourceOption.value = element.deviceId;
            sourceSelect.appendChild(sourceOption);
          });

          sourceSelect.onchange = () => {
            selectedDeviceId = sourceSelect.value;
          };

          const sourceSelectPanel = document.getElementById('sourceSelectPanel');
          sourceSelectPanel.style.display = 'block';
        }

        document.getElementById('startButton').addEventListener('click', () => {
          const decodingStyle = document.getElementById('decoding-style').value;
          if (decodingStyle === "once") {
            decodeOnce(codeReader, selectedDeviceId);
          } else {
            decodeContinuously(codeReader, selectedDeviceId);
          }
          console.log(`Started decode from camera with id ${selectedDeviceId}`);
        });

        document.getElementById('resetButton').addEventListener('click', () => {
          codeReader.reset();
          document.getElementById('result').textContent = '';
          console.log('Reset.');
        });

      })
      .catch((err) => {
        console.error(err);
      });

    function decodeOnce(codeReader, selectedDeviceId) {
      codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video').then((result) => {
        console.log(result);
        document.getElementById('result').textContent = result.text;
      }).catch((err) => {
        console.error(err);
        document.getElementById('result').textContent = err;
      });
    }

    function decodeContinuously(codeReader, selectedDeviceId) {
      codeReader.decodeFromInputVideoDeviceContinuously(selectedDeviceId, 'video', (result, err) => {
        if (result) {
          console.log('Found QR code!', result);
          document.getElementById('result').textContent = result.text;
        }

        if (err) {
          if (err instanceof ZXing.NotFoundException) {
            console.log('No QR code found.');
          }

          if (err instanceof ZXing.ChecksumException) {
            console.log('A code was found, but it\'s read value was not valid.');
          }

          if (err instanceof ZXing.FormatException) {
            console.log('A code was found, but it was in a invalid format.');
          }
        }
      });
    }
  }, []);

  return (
    <div>
      <Head>
        <title>ZXing TypeScript | Decoding from camera stream</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
        <link rel="stylesheet" href="https://unpkg.com/normalize.css@8.0.0/normalize.css" />
        <link rel="stylesheet" href="https://unpkg.com/milligram@1.3.0/dist/milligram.min.css" />
        <script src="https://unpkg.com/@zxing/library@latest" />
      </Head>
      <main className="wrapper" style={{ paddingTop: '2em' }}>
        <section className="container" id="demo-content">
          <div>
            <a className="button" id="startButton">Start</a>
            <a className="button" id="resetButton">Reset</a>
          </div>
          <div>
            <video id="video" width="300" height="200" style={{ border: '1px solid gray' }} />
          </div>
          <div id="sourceSelectPanel" style={{ display: 'none' }}>
            <label htmlFor="sourceSelect">Change video source:</label>
            <select id="sourceSelect" style={{ maxWidth: '400px' }} />
          </div>
          <div style={{ display: 'table' }}>
            <label htmlFor="decoding-style"> Decoding Style:</label>
            <select id="decoding-style" size="1" defaultValue="continuously">
              <option value="once">Decode once</option>
              <option value="continuously">Decode continuously</option>
            </select>
          </div>
          <label>Result:</label>
          <pre><code id="result" /></pre>
          <p>See the <a href="https://github.com/zxing-js/library/tree/master/docs/examples/qr-camera/">source code</a> for
            this example.</p>
        </section>
        <footer className="footer">
          <section className="container">
            <p>ZXing TypeScript Demo. Licensed under the <a target="_blank"
              href="https://github.com/zxing-js/library#license" title="MIT">MIT</a>.</p>
          </section>
        </footer>
      </main>
    </div>
  );
};

export default QRCodeScanner;