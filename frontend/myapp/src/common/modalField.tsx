import { ModalShowContext } from 'App';
import React, { useContext, createContext, useReducer } from 'react';

const ModalField = () => {
  const { show, dispatch } = useContext(ModalShowContext);

  if (show === true) {
    return (
      <div className="login-form">
        <p>モーダル表示ok</p>
        <button onClick={() => dispatch()}>Close</button>
      </div>
    );
  } else {
    return null;
  }
}

export default ModalField;
