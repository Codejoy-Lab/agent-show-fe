import { AxiosResponse } from 'axios';
import req from '.';

//语音识别
export const startTapeApi = async () => {
  return await req.post('/start_asr');
};
// 关闭语音识别
export const stopTapeApi = async () => {
  return await req.post('/stop_asr');
};

//调用大模型 返回answer
export const callLlm = async (role: string, question: string):Promise<{data:string}> => {
  return await req.post(`/start_llm_question/${role}/${question}`);
};

// 获取语音识别的question
export const getQuestion = async (): Promise<string> => {
  return await req.get('/question');
};
// // 获取语音识别的answer
// export const getAnswer = async (): Promise<string> => {
//   return await req.get('/start_llm_question');
// };
// 发送播放指令
export const sendPlayOlder = async (role: string, question: string) => {
  return await req.post(`/start_llm_paly/${role}/${question}`);
};
