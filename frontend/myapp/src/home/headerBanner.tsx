import React, { useState, useContext, createContext, useReducer } from 'react';
import { ModalShowContext } from 'App';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Signup from 'signup/signup';

const HeaderBanner = () => {
  const { show, dispatchShow } = useContext(ModalShowContext);

  const Home = () => {
    return (
      <div>
        <h1>Welcome to my App!!</h1>
      </div>
    );
  }

  const Login = () => {
    return (
      <div>
        <h3>Login form</h3>
      </div>
    );
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
    </div>
  );
}



export default HeaderBanner;
