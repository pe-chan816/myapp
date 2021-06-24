import { ModalStateContext } from 'App';
import { LoginStateContext } from 'App';

import React, { useContext, createContext, useReducer } from 'react';

const ModalField = () => {
  const { modalState, dispatchModalState } = useContext(ModalStateContext);
  const { loginState, dispatchLoginState } = useContext(LoginStateContext);

  if (modalState === true) {
    return (
      <div className="login-form">
        <p>モーダル表示ok</p>
        <p>{String(loginState)}</p>
        <button onClick={() => dispatchLoginState()}>ログイン状況変更</button>
        <button onClick={() => dispatchModalState()}>Close</button>
      </div>
    );
  } else {
    return null;
  }
}

export default ModalField;
