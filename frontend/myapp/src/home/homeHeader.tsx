import React, { useState, useContext, createContext, useReducer } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';

import { LoginStateContext } from 'App';
import { ModalStateContext } from 'App';
import { CurrentUserContext } from 'App';

const HomeHeader = () => {
  const { modalState, dispatchModalState } = useContext(ModalStateContext);
  const { loginState, dispatchLoginState } = useContext(LoginStateContext);
  const currentUser = useContext(CurrentUserContext);
  console.log(currentUser);

  const Home = () => {
    if (currentUser) {
      return (
        <div>
          <p>currentuserはいる</p>
          <p>{String(currentUser)}</p>
        </div>
      );
    } else {
      return (
        <p>ユーザー情報がない</p>
      );
    }
    /*
    return (
      <div>
        <h1>Welcome to my App!!</h1>
      </div>
    );
    */
  }

  const handleLogoutClick = () => {
    axios.delete("http://localhost:3000/logout", { withCredentials: true }).then(response => {
      console.log("ログアウト状況: ", response);
      dispatchLoginState();
    }).catch(error => console.log("ログアウトエラー", error));
  }

  return (
    <div className="header-banner">
      <p>ログイン中</p>
      <Router>
        <Link to="/"><h1>Insyutagram</h1></Link>
        <nav>
          <Link to="">マイページ</Link>
          <Link to="">ユーザー一覧</Link>
          <Link to="">マイいいね</Link>
          <Link to="">タグ一覧</Link>
          <Link to="">プロフィール編集</Link>
        </nav>

        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
      </Router>
      <button onClick={() => dispatchModalState()}>モーダル</button>
      <button onClick={() => handleLogoutClick()}>ログアウト</button>
    </div>
  );
}



export default HomeHeader;
