import React, { useLayoutEffect, useState } from 'react';
import { Button, Drawer, Modal, Upload } from 'antd';
import styles from './index.module.scss';
import Card from '../Home/Components/Card';
import ChatBox from '../Home/Components/ChatBox';
import { useNavigate, useLocation } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import {
  startTapeApi,
  stopTapeApi,
  getQuestion,
  callLlm,
  // getAnswer,
  sendPlayOlder,
} from '../../request/api';
import { devUseWarning } from 'antd/es/_util/warning';
// import { startRecording, stopRecording, processRecordedData } from './utils';
// import { AxiosResponse } from 'axios';
export default () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { params } = location.state;
  const [open, setOpen] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [openUploadModal, setOpenUploadModal] = useState(false);
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
    { text: '你好, 有什么问题都可以咨询我', user: 'them' },
  ]);

  const handleBack = () => {
    setOpen(false);
  };
  const handleStop = () => {
    stopTapeApi().then(async () => {
      const question = await getQuestion();
      setMessages((old) => [...old, { text: question, user: 'you' }]);
      const answer = await callLlm('lawyer', question);
      console.log('answer', answer.data);
      sendPlayOlder('lawyer', answer.data);
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
              <ChatBox messages={messages} />
            </div>
            <div className={styles.footer}>
              <BigButton type="primary" onClick={handleBack}>
                返回
              </BigButton>{' '}
              <BigButton type="primary" onClick={handleUpload}>
                文本分析
              </BigButton>{' '}
              <RecordButton
                type="primary"
                handleStop={handleStop}
                onClick={startTapeApi}
              >
                提问
              </RecordButton>{' '}
            </div>
          </div>
          <div className={styles.right}>
            <Card {...params} style={{ height: '80%', width: '100%' }} />
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
  const { handleStop } = props;

  const list = [
    {
      title: '点击语音提问',
      setup: 0,
      handle: async () => {
        if (status.setup == 0) {
          setStatus(list[1]);
        }
      },
    },
    {
      title: '发送你的问题',
      setup: 1,
      handle: async (status: { setup: number }) => {
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
