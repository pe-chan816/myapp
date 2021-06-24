import React, { useState, createContext, useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import ModalField from 'common/modalField';
import HomeBase from 'home/homeBase';

// モーダルを共有するためのコンテクスト
export const ModalShowContext = createContext({
  show: {},
  dispatchShow: () => { }
});

export const showFunction = (show: boolean) => {
  return !show;
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
export const LoginUserContext = createContext({
  loginUser: {}
});

const App = () => {
  const [show, dispatchShow] = useReducer(showFunction, false);
  const [loginState, dispatchLoginState] = useReducer(loginStateFunction, false);
  const [loginUser, setLoginUser] = useState({});

  console.log(loginUser);

  useEffect(() => {
    if (loginState === false) {
      checkLoginStatus();
    }
  }, [loginState]);

  const checkLoginStatus = () => {
    axios.get("http://localhost:3000/check_login", { withCredentials: true }).then(response => {
      console.log("ログイン状況 :", response);
      if (response.data.logged_in === true) {
        dispatchLoginState();
        setLoginUser(response.data.user);
      } else {
        setLoginUser({});
      }
    }).catch(response => {
      console.log("ログインエラー", response);
    })
  }

  return (
    <>
      <Router>
        <LoginStateContext.Provider value={{ loginState, dispatchLoginState }}>
          <LoginUserContext.Provider value={{ loginUser }}>
            <ModalShowContext.Provider value={{ show, dispatchShow }}>
              <HomeBase />
              <ModalField />
            </ModalShowContext.Provider>
          </LoginUserContext.Provider>
        </LoginStateContext.Provider>
      </Router>
    </>
  );
}

export default App;

/*
// うざいけど消しちゃダメ
export default User;
import axios from 'axios';

function useGetElement() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  axios.get(`http://localhost:3000/`).then(res => {
    setUserName(res.data.name);
    setUserId(res.data.id);
  })
  const data = {
    name: userName,
    id: userId
  }
  return (
    data
  );
}

function User() {
  const name = useGetElement().name
  const id = useGetElement().id
  return (
    <div>
      <p>{name}</p>
      <p>{id}</p>
    </div>
  );
}
*/
