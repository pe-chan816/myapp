import React, { useState, createContext, useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import ModalField from 'common/modalField';
import HomeBase from 'home/homeBase';
import { boolean } from 'yargs';

// モーダルを共有するためのコンテクスト
export const ModalStateContext = createContext({
  modalState: {},
  dispatchModalState: () => { }
});

export const modalStateFunction = (modalState: boolean) => {
  return !modalState;
}

// ログイン状態を共有するためのコンテクスト
export const LoginStateContext = createContext({
  loginState: {},
  dispatchLoginState: () => { }
});

export const loginStateFunction = (loginState: boolean) => {
  return !loginState;
}

// ログインユーザーを共有するためのコンテクスト
type userType = {
  admin: boolean;
  email: string;
  gueat: boolean;
  name: string;
  id: number;
}
export const CurrentUserContext = createContext<Partial<userType>>({});

const App = () => {
  const [modalState, dispatchModalState] = useReducer(modalStateFunction, false);
  const [loginState, dispatchLoginState] = useReducer(loginStateFunction, false);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    if (loginState === false) {
      checkLoginStatus();
    }
  }, [loginState]);

  const checkLoginStatus = () => {
    axios.get("http://localhost:3000/check_login", { withCredentials: true }).then(response => {
      if (response.data.logged_in === true) {
        dispatchLoginState();
        setCurrentUser(response.data.user);
      } else {
        setCurrentUser({});
      }
    }).catch(response => {
      console.log("ログインエラー", response);
    })
  }

  return (
    <>
      <Router>
        <LoginStateContext.Provider value={{ loginState, dispatchLoginState }}>
          <CurrentUserContext.Provider value={currentUser}>
            <ModalStateContext.Provider value={{ modalState, dispatchModalState }}>
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
