// ChatBox.js
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';

const ChatBox = (props: {
  messages: any[];
  messageProcessFinsh: () => void;
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const { messages, messageProcessFinsh } = props;
  return (
    <div ref={boxRef} className={styles['chat-box']}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`${styles['message']} ${
            message.user === 'you' ? styles['sent'] : styles['received']
          }`}
        >
          <MessageBox
            messageProcessFinsh={messageProcessFinsh}
            parent={boxRef.current}
            message={message.text}
            user={message.user}
          />
        </div>
      ))}
    </div>
  );
};
// function scrollToBottom(elementId) {
//   let element = document.getElementById(elementId);
//   element.scrollTop = element.scrollHeight;
// }
const MessageBox = (props: {
  message: string;
  user: string;
  parent: HTMLDivElement | null;
  messageProcessFinsh: () => void;
}) => {
  const { message = '', user = '', parent, messageProcessFinsh } = props;
  const timeIdRef = useRef(1);
  const [showMessgae, setShowMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const delay = 100;
  useEffect(() => {
    console.log('处理message', message);
    if (user == 'you') {
      setShowMessage(message);
      return;
    }
    if (currentIndex < message.length) {
      clearInterval(timeIdRef.current);
      timeIdRef.current = setTimeout(() => {
        setShowMessage(message.substring(0, currentIndex + 1));
        setCurrentIndex((old) => old + 1);
        if (parent) {
          console.log(parent.scrollHeight);

          parent.scrollTop = parent.scrollHeight;
        }
      }, delay);
      return;
    } else {
      messageProcessFinsh();
    }

    return () => {
      clearInterval(timeIdRef.current);
    };
  }, [message, currentIndex]);
  return <p>{showMessgae}</p>;
};

export default ChatBox;
