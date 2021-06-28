import { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import ModalField from 'common/modalField';
import HomeBase from 'home/homeBase';

// モーダルを共有するためのコンテクスト
export const ModalStateContext = createContext({} as {
  modalState: boolean,
  setModalState: any
});

// ログイン状態を共有
export const LoginStateContext = createContext({} as {
  loginState: boolean,
  setLoginState: any
});


// ログインユーザーが誰かを共有
type currentUserType = {
  admin: boolean;
  email: string;
  gueat: boolean;
  id: number;
  name: string;
  profile_image: {
    url?: string
  };
}
export const CurrentUserContext = createContext({} as {
  currentUser: Partial<currentUserType>,
  setCurrentUser: any
});

// 格納したメッセージを共有
export const MessageContext = createContext({} as {
  message: string[],
  setMessage: any
});

const App = () => {
  const [modalState, setModalState] = useState<boolean>(false);
  const [loginState, setLoginState] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Partial<currentUserType>>({});
  const [message, setMessage] = useState<string[]>([]);

  useEffect(() => {
    if (loginState === false) {
      checkLoginStatus();
    }
  }, [loginState]);

  const checkLoginStatus = () => {
    axios.get("http://localhost:3000/check_login", { withCredentials: true }).then(response => {
      if (response.data.logged_in === true) {
        setLoginState(true);
        setCurrentUser(response.data.user);
      } else {
        setCurrentUser({});
      }
    }).catch(response => {
      console.log("ログインエラー", response);
    })
  }
  console.log(loginState);
  return (
    <>
      <Router>
        <LoginStateContext.Provider value={{ loginState, setLoginState }}>
          <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
            <ModalStateContext.Provider value={{ modalState, setModalState }}>
              <MessageContext.Provider value={{ message, setMessage }}>
                <HomeBase />
                <ModalField />
              </MessageContext.Provider>
            </ModalStateContext.Provider>
          </CurrentUserContext.Provider>
        </LoginStateContext.Provider>
      </Router>
    </>
  );

}

export default App;
