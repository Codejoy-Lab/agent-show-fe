export function startEventStream(
  role: string,
  question: string,
  acceptCallback: any,
  sseClose: any
) {
  // 创建EventSource实例，连接到服务器的SSE端点

  let url = `http://localhost:8000/api/start_llm_paly/${role}/${question}`;   
  var source = new EventSource(url);

  // 定义处理接收到的消息的回调函数
  source.onmessage = function (event) {
    // event.data包含服务器发送的数据
    const char = event.data.replace('data: ', '');
    acceptCallback(char);
  };

  // 可选：处理错误
  source.onerror = function (event) {
    console.error('Error occurred:', event);
    sseClose();
    source.close();
  };
}
