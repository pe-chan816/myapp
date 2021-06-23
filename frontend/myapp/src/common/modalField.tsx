import { ModalShowContext } from 'App';
import { LoginStateContext } from 'App';

import React, { useContext, createContext, useReducer } from 'react';

const ModalField = () => {
  const { show, dispatchShow } = useContext(ModalShowContext);
  const { loginState, dispatchLoginState } = useContext(LoginStateContext);

  if (show === true) {
    return (
      <div className="login-form">
        <p>モーダル表示ok</p>
        <p>{String(loginState)}</p>
        <button onClick={() => dispatchLoginState()}>ログイン状況変更</button>
        <button onClick={() => dispatchShow()}>Close</button>
      </div>
    );
  } else {
    return null;
  }
}

export default ModalField;
