import { ModalStateContext } from 'App';
import { LoginStateContext } from 'App';

import { useContext } from 'react';

const ModalField = () => {
  const { modalState, setModalState } = useContext(ModalStateContext);
  const { loginState, setLoginState } = useContext(LoginStateContext);

  if (modalState === true) {
    return (
      <div className="login-form">
        <p>モーダル表示ok</p>
        <p>{String(loginState)}</p>
        <button onClick={() => setLoginState(!loginState)}>ログイン状況変更</button>
        <button onClick={() => setModalState(false)}>Close</button>
      </div>
    );
  } else {
    return null;
  }
}

export default ModalField;
