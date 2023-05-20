function getLocalStream() {
  const audioSource = audioInputSelect1.value;
  const constraints = {
    audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
  };
  const audioSource1 = audioInputSelect2.value;
  const constraints1 = {
    audio: {deviceId: audioSource1 ? {exact: audioSource1} : undefined},
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      window.localStream = stream; // A
      window.localAudioMic1.srcObject = stream; // B
      window.localAudioMic1.autoplay = true; // C
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`);
    });
  navigator.mediaDevices
    .getUserMedia(constraints1)
    .then((stream) => {
      window.localStream = stream; // A
      window.localAudioMic2.srcObject = stream; // B
      window.localAudioMic2.autoplay = true; // C
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`);
    });
  window.localAudioMic2.play
  window.localAudioMic1.play
}

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  const audioInputSelect1 = document.querySelector('select#audioSource1');
  const audioInputSelect2 = document.querySelector('select#audioSource2');
  const selectors = [audioInputSelect1,audioInputSelect2];
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    const option2 = document.createElement('option');
    option.value = deviceInfo.deviceId;
    option2.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label || `microphone ${audioInputSelect2.length + 1}`;
      audioInputSelect2.appendChild(option);
      option2.text = deviceInfo.label || `microphone ${audioInputSelect1.length + 1}`;
      audioInputSelect1.appendChild(option2);
    } else {}
  }
  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex];
    }
  });
  getLocalStream()
}

navigator.mediaDevices.enumerateDevices().then(gotDevices);

const audioInputSelect1 = document.querySelector('select#audioSource1');
const audioInputSelect2 = document.querySelector('select#audioSource2');
audioInputSelect1.onchange = getLocalStream;
audioInputSelect2.onchange = getLocalStream;
