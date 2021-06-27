import { useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { ModalStateContext } from "App";

import Login from "login/login";
import Signup from "signup/signup";

const NotLoginHomeHeader = () => {
  const { modalState, setModalState } = useContext(ModalStateContext);

  const Home = () => {
    return (
      <div>
        <h1>Welcome to my App!!</h1>
      </div>
    );
  }

  return (
    <div className="header-banner">
      <p>未ログイン</p>
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
      <button onClick={() => setModalState(!modalState)}>モーダル</button>
    </div>
  );
}

export default NotLoginHomeHeader;
