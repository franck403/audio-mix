function handlerFunction(stream,num) {
  if (num == 1) {
    rec1 = new MediaRecorder(stream);
    rec1.ondataavailable = e => {
      audioChunks1.push(e.data);
      if (rec1.state == "inactive") {
        let blob = new Blob(audioChunks1, { type: 'audio/mpeg-3' });
        var recordedAudios = document.getElementById("recordedAudio_" + num)
        recordedAudios.src = URL.createObjectURL(blob);
        recordedAudios.controls = true;
        recordedAudios.autoplay = true;
        sendData(blob)
      }
    }
  } else if (num == 2) {
    rec2 = new MediaRecorder(stream);
    rec2.ondataavailable = e => {
      audioChunks2.push(e.data);
      if (rec2.state == "inactive") {
        let blob = new Blob(audioChunks2, { type: 'audio/mpeg-3' });
        var recordedAudios = document.getElementById("recordedAudio_" + num)
        recordedAudios.src = URL.createObjectURL(blob);
        recordedAudios.controls = true;
        recordedAudios.autoplay = true;
        sendData(blob)
      }
    }

  }
}
function sendData(data) { }

record.onclick = e => {
  record.disabled = true;
  record.style.backgroundColor = "blue"
  stopRecord.disabled = false;
  audioChunks1 = [];
  audioChunks2 = [];
  rec1.start();
  rec2.start();
}
stopRecord.onclick = e => {
  record.disabled = false;
  stop.disabled = true;
  record.style.backgroundColor = "red"
  rec2.stop();
  rec1.stop();
}

function getLocalStream() {
  const audioSource = audioInputSelect1.value;
  const constraints = {
    audio: { deviceId: audioSource ? { exact: audioSource } : undefined },
  };
  const audioSource1 = audioInputSelect2.value;
  const constraints1 = {
    audio: { deviceId: audioSource1 ? { exact: audioSource1 } : undefined },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      window.localAudioMic1.srcObject = stream; // B
      window.localAudioMic1.autoplay = true; // C
      handlerFunction(stream,1)
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`);
    });
  navigator.mediaDevices
    .getUserMedia(constraints1)
    .then((stream) => {
      window.localAudioMic2.srcObject = stream; // B
      window.localAudioMic2.autoplay = true; // C
      handlerFunction(stream,2)
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`);
    });
}

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  const audioInputSelect1 = document.querySelector('select#audioSource1');
  const audioInputSelect2 = document.querySelector('select#audioSource2');
  const selectors = [audioInputSelect1, audioInputSelect2];
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  const option3 = document.createElement('option');
  const option4 = document.createElement('option');
  option3.value = "select_mic"
  option4.value = "select_mic"
  option3.text = "select_mic"
  option4.text = "select_mic"
  audioInputSelect2.appendChild(option3);
  audioInputSelect1.appendChild(option4);
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
    } else { }
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

window.localAudioMic1.volume = 1
window.localAudioMic2.volume = 1
audioInputSelect1.onchange = getLocalStream;
audioInputSelect2.onchange = getLocalStream;

function changeValue1(value) {
  document.getElementById("vol_rangep1").innerHTML = value
  if (value == 100) {
    window.localAudioMic1.volume = 1
  } else {
    window.localAudioMic1.volume = Number("0." + value)
  }
  document.getElementById("vol_range1").className = '';
  document.getElementById("vol_range1").classList.add('range_' + value);
}


function changeValue2(value) {
  document.getElementById("vol_rangep2").innerHTML = value
  if (value == 100) {
    window.localAudioMic2.volume = 1
  } else {
    window.localAudioMic2.volume = Number("0." + value)
  }
  document.getElementById("vol_range2").className = '';
  document.getElementById("vol_range2").classList.add('range_' + value);
}

function changeState1() {
  if (window.localAudioMic1.volume != 0) {
    window.localAudioMic1.volume = 0
  } else {
    var value = document.getElementById("vol_range1").value
    if (value == 100) {
      window.localAudioMic1.volume = 1
    } else {
      window.localAudioMic1.volume = Number("0." + value)
    }
  }
}

function changeState2() {
  if (window.localAudioMic2.volume != 0) {
    window.localAudioMic2.volume = 0
  } else {
    var value = document.getElementById("vol_range2").value
    if (value == 100) {
      window.localAudioMic2.volume = 1
    } else {
      window.localAudioMic2.volume = Number("0." + value)
    }
  }
}

