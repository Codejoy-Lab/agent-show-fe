const check = () => {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
    console.error('浏览器不支持录音功能');
    return false;
  }
};

const getUserMedia = async () => {
  const constraints = { audio: true };
  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error('麦克风授权失败:', error);
  }
};

const initMediaRecorder = async (stream: MediaStream, chunks: Blob[]) => {
  let mediaRecorder;

  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  mediaRecorder.onerror = (event) => {
    console.error('录音出错:', event);
  };
  return mediaRecorder;
};

export async function startRecording(chunks: Blob[]) {
  if (!check()) {
    return;
  }
  const stream = await getUserMedia();
  // let chunks: Blob[] = [];
  let mediaRecorder;

  if (stream) {
    mediaRecorder = await initMediaRecorder(stream, chunks);
    mediaRecorder.start();
    console.log('录音开始');
  }
}
export function stopRecording(mediaRecorder: MediaRecorder, chunks: Blob[]) {
  mediaRecorder.stop();
  console.log('录音停止');
  const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
  const url = URL.createObjectURL(blob);
}
export function processRecordedData(chunks: Blob[]) {
  const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
  const url = URL.createObjectURL(blob);
}
export function hasTouch() {
  return 'ontouchstart' in document;
}
