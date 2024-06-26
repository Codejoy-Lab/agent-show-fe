import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, Drawer, Modal, Upload } from 'antd';
import styles from './index.module.scss';
import Card from '@/Pages/Home/Components/Card';
import ChatBox from '@/Pages/Home/Components/ChatBox';
import { useNavigate, useLocation } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import {
  startTapeApi,
  stopTapeApi,
  getQuestion,
  callLlm,
  //   sendPlayOlder,
} from '@/request/api';
import { startRecording, stopRecording, initMediaRecorder } from './utils';

import { startEventStream } from '@/request/sse';
export default () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { params } = location.state;
  const [open, setOpen] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [roleStatus, setRoleatus] = useState(1);
  const [chatId, setChatId] = useState(0);
  console.log('roleStatus', roleStatus);
  // const [ videoUrl, setVideoUrl ]= useState(params.videoUrls[0]);
  useLayoutEffect(() => {
    function updateSize() {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // 初次渲染时获取尺寸
    updateSize();
    // 添加监听器以在窗口大小变化时更新尺寸
    window.addEventListener('resize', updateSize);
    // 清理函数，移除监听器以防止内存泄漏
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const [messages, setMessages] = useState<{ text: string; user: string }[]>([
    { text: '你好, 有什么法律问题都可以咨询我哦', user: 'them' },
  ]);
  const mediaRecorderRef = useRef<any>(null);
  const chunksRef = useRef([]);
  const handleBack = () => {
    setOpen(false);
  };

  const onClose = async (event: any, chunks: any[]) => {
    const blob = new Blob(chunks, {
      type: 'audio/webm;codecs=opus',
    });
    console.log('Blob的大小为:', blob.size, '字节');

    const file = new File([blob], 'myCustomFileName.webm', {
      type: 'audio/webm;codecs=opus',
    });

    const formData = new FormData();
    formData.append('file', file);
    chunksRef.current = [];

    const res = await startTapeApi(formData);
    console.log(res);
  };
  const handlestartTape = async () => {
    // let chunks: any[] = [];
    const recoder = await startRecording(chunksRef.current, onClose);
    if (recoder) {
      mediaRecorderRef.current = recoder;
    }
    console.log('chunks', chunksRef.current);
    return;
    // setRoleatus(3);

    // startTapeApi();
  };
  const acceptCallback = (data: string) => {
    console.log('关闭', data);
    //切换角色动作
    setRoleatus(1);
    setChatId(Math.floor(Math.random() * 100));
  };
  const sseClose = () => {
    console.log('sse 关闭');
    setRoleatus(1);
    setChatId(Math.floor(Math.random() * 100));
  };

  const handleStop = async () => {
    stopRecording(mediaRecorderRef.current);
    console.log('停止录音', chunksRef.current);
    return;
    const blob = new Blob(chunksRef.current, {
      type: 'audio/webm;codecs=opus',
    });
    console.log('Blob的大小为:', blob.size, '字节');

    const file = new File([blob], 'myCustomFileName.webm', {
      type: 'audio/webm;codecs=opus',
    });

    const formData = new FormData();
    formData.append('file', file);
    chunksRef.current = [];

    await startTapeApi(formData);
    return;

    setRoleatus(2);
    stopTapeApi().then(async () => {
      const question = await getQuestion();
      setMessages((old) => [...old, { text: question, user: 'you' }]);
      const answer = await callLlm(params.role, question);
      console.log('answer', answer.data);
      startEventStream(params.role, answer.data, acceptCallback, sseClose);
      setRoleatus(2);
      setMessages((old) => [...old, { text: answer.data, user: 'them' }]);
    });
  };
  const handleUpload = () => {
    setOpenUploadModal(true);
  };
  const handleUplaodOk = () => {
    setOpenUploadModal(false);
    // const answer = await callLlm('lawyer', '');
    // sendPlayOlder('lawyer', answer.data);
  };
  // const [isRestRecord, setIsRestRecord] = useState(false);
  const handleMessageProcessFinsh = async () => {
    // setIsRestRecord(true);
  };
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Drawer
        afterOpenChange={(open) => {
          if (!open) {
            navigate('/');
          }
        }}
        destroyOnClose={true}
        width={screenSize.width}
        open={open}
        footer={false}
        closable={false}
        mask={false}
        // drawerRender={custom}
        zIndex={1000}
        getContainer={false}
      >
        <div className={styles.contentContainer}>
          <div className={styles.left}>
            <div className={styles.message}>
              <ChatBox
                messageProcessFinsh={handleMessageProcessFinsh}
                messages={messages}
              />
            </div>
            <div className={styles.footer}>
              <BigButton type="primary" onClick={handleBack}>
                返回
              </BigButton>{' '}
              <BigButton type="primary" onClick={handleUpload}>
                文本分析
              </BigButton>{' '}
              <RecordButton
                chatId={chatId}
                // isReset={isRestRecord}
                type="primary"
                handleStop={handleStop}
                handlestartTape={handlestartTape}
              />
            </div>
          </div>
          <div className={styles.right}>
            <Card
              {...params}
              key={params.videoUrls[roleStatus]}
              videoUrl={params.videoUrls[roleStatus]}
              style={{ height: '80%', width: '100%' }}
            />
          </div>
        </div>
      </Drawer>
      <Modal
        title="上传分析文件"
        open={openUploadModal}
        onOk={() => {
          handleUplaodOk();
        }}
        onCancel={() => {
          setOpenUploadModal(false);
        }}
        okText="上传"
        cancelText="取消"
      >
        <Upload
          beforeUpload={() => {
            return false;
          }}
        >
          {' '}
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Modal>
    </div>
  );
};

const BigButton = (props: any) => {
  const { children } = props;
  return (
    <Button
      {...props}
      style={{ height: '100%', width: '30%', fontSize: '22px' }}
    >
      {children}
    </Button>
  );
};
const RecordButton = (props: any) => {
  const { handleStop, handlestartTape, chatId } = props;

  const list = [
    {
      title: '点击语音提问',
      setup: 0,
      handle: async (status: { setup: number }) => {
        if (status.setup == 0) {
          handlestartTape();
          setStatus(list[1]);
        }
      },
    },
    {
      title: '发送你的问题',
      setup: 1,
      handle: async (status: { setup: number }) => {
        console.log(status);

        if (status.setup == 1) {
          handleStop();
          setStatus(list[2]);
        }
      },
    },
    {
      title: '回答中...',
      setup: 2,
      handle: (status: any) => {},
    },
  ];
  const [status, setStatus] = useState(list[0]);

  useEffect(() => {
    setStatus(list[0]);
  }, [chatId]);
  useEffect(() => {
    console.log('提问', status);
  }, [status]);
  return (
    <BigButton
      {...props}
      onClick={() => {
        status.handle(status);
      }}
    >
      {status.title}
    </BigButton>
  );
};
