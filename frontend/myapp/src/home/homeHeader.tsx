import { useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';

import { LoginStateContext } from 'App';
import { ModalStateContext } from 'App';
import { CurrentUserContext } from 'App';

import MyPage from 'user/myPage';
import UpdateUserSettings from 'user/updateUserSettings';


const HomeHeader = () => {
  const { setModalState } = useContext(ModalStateContext);
  const { setLoginState } = useContext(LoginStateContext);
  const { currentUser } = useContext(CurrentUserContext);

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
      setLoginState(false);
    }).catch(error => console.log("ログアウトエラー", error));
  }

  console.log(currentUser);
  return (
    <div className="header-banner">
      <p>ログイン中</p>
      <Router>
        <Link to="/"><h1>Insyutagram</h1></Link>
        <nav>
          <Link to={`/user/${currentUser.id}`}>マイページ</Link>
          <Link to="">ユーザー一覧</Link>
          <Link to="">マイいいね</Link>
          <Link to="">タグ一覧</Link>
          <Link to="/user/edit/account">アカウント設定</Link>
        </nav>

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path='/user/:myPageId' exact component={MyPage} />
          <Route path="/user/edit/account" exact component={UpdateUserSettings} />
          <Route><h1>404 NOT FOUND</h1></Route>
        </Switch>
      </Router>
      <button onClick={() => setModalState(true)}>モーダル</button>
      <button onClick={() => handleLogoutClick()}>ログアウト</button>
    </div>
  );
}

export default HomeHeader;
