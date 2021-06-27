import { useState, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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
type userType = {
  admin: boolean;
  email: string;
  gueat: boolean;
  name: string;
  id: number;
}
export const CurrentUserContext = createContext({} as {
  currentUser: Partial<userType>,
  setCurrentUser: any
});

const App = () => {
  const [modalState, setModalState] = useState<boolean>(false);
  const [loginState, setLoginState] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Partial<userType>>({});

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
              <HomeBase />
              <ModalField />
            </ModalStateContext.Provider>
          </CurrentUserContext.Provider>
        </LoginStateContext.Provider>
      </Router>
    </>
  );

}

export default App;
