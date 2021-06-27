import { ModalStateContext } from 'App';
import { LoginStateContext } from 'App';
import { MessageContext } from 'App';

import { useContext } from 'react';

const ModalField = () => {
  const { modalState, setModalState } = useContext(ModalStateContext);
  const { loginState, setLoginState } = useContext(LoginStateContext);
  const { message, setMessage } = useContext(MessageContext);

  const CloseModal = () => {
    setModalState(false);
    setMessage([]);
  }

  const MessageDisplay = () => {
    const messages = message.map((e, i) => <p key={i}>{e}</p>);
    return <div>{messages}</div>
  }

  if (modalState === true) {
    return (
      <div className="login-form">
        <p>モーダル表示ok</p>
        <p>{String(loginState)}</p>
        <MessageDisplay />
        <button onClick={() => setLoginState(!loginState)}>ログイン状況変更</button>
        <button onClick={CloseModal}>Close</button>
      </div>
    );
  } else {
    return null;
  }
}

export default ModalField;
