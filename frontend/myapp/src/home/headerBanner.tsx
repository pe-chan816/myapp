import React, { useState, useContext, createContext, useReducer } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';

import Signup from 'signup/signup';
import Login from 'login/login';

import { LoginStateContext } from 'App';
import { ModalShowContext } from 'App';
import { LoginUserContext } from 'App';

const HeaderBanner = () => {
  const { show, dispatchShow } = useContext(ModalShowContext);
  const { loginState, dispatchLoginState } = useContext(LoginStateContext);

  const Home = () => {
    return (
      <div>
        <h1>Welcome to my App!!</h1>
      </div>
    );
  }

  const handleLogoutClick = () => {
    axios.delete("http://localhost:3000/logout", { withCredentials: true }).then(response => {
      console.log("ログアウト状況: ", response);
      dispatchLoginState();
    }).catch(error => console.log("ログアウトエラー", error));
  }

  return (
    <div className="header-banner">
      <Router>
        <Link to="/"><h1>Insyutagram</h1></Link>
        <nav>
          <Link to="/login">ログイン</Link>
          <Link to="/signup">アカウント登録</Link>
        </nav>

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
        </Switch>
      </Router>
      <button onClick={() => dispatchShow()}>モーダル</button>
      <button onClick={() => handleLogoutClick()}>ログアウト</button>
    </div>
  );
}



export default HeaderBanner;
