import React, { ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';
import './index.css';
export default (props: {
  show: boolean;
  children: ReactNode;
  classNames: string;
}) => {
  const { show, children } = props;
  return (
    <CSSTransition
      in={show}
      timeout={1000} // 动画持续时间，单位为毫秒
      classNames={'fade'} // 指定CSS类名，用于定义进入与离开的动画
      unmountOnExit // 当过渡完成且组件需要被卸载时启用
      onExited={() => console.log('Component has exited.')}
    >
      {children}
    </CSSTransition>
  );
};
