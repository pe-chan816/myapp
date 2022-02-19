import { useState, createContext, useEffect, SetStateAction } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import { AlertSeverityType, UserType } from 'types/typeList';

import HomeBase from 'home/homeBase';

// ログイン状態を共有
export const LoginStateContext = createContext({} as {
  loginState: boolean,
  setLoginState: any
});

export const CurrentUserContext = createContext({} as {
  currentUser: Partial<UserType>,
  //currentUser: Partial<currentUserType>,
  setCurrentUser: any
});

// 対象のユーザーの情報を共有
export const UserContext = createContext({} as {
  user: Partial<UserType>,
  //user: Partial<currentUserType>,
  setUser: any
});

// 対象ユーザーのフォロー状況を共有
export const FollowOrNotContext = createContext({} as {
  followOrNot: boolean,
  setFollowOrNot: any
});

// アラートメッセージ表示管理
export const AlertDisplayContext = createContext({} as {
  alertDisplay: boolean,
  setAlertDisplay: any
});

export const AlertSeverityContext = createContext({} as {
  alertSeverity: AlertSeverityType,
  setAlertSeverity: any
});

// メッセージを格納
export const MessageContext = createContext({} as {
  message: string[],
  setMessage: any
});

// サイドメニューの表示管理
export const DrawerContext = createContext({} as {
  drawerDisplay: boolean,
  setDrawerDisplay: any
});


const App = () => {
  const [loginState, setLoginState] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserType | {}>({});
  const [message, setMessage] = useState<string[]>([]);

  const [user, setUser] = useState<Partial<UserType>>({});
  const [followOrNot, setFollowOrNot] = useState<boolean>(false);

  const [alertDisplay, setAlertDisplay] = useState<boolean>(false);
  const [alertSeverity, setAlertSeverity] = useState<AlertSeverityType>("success");

  const [drawerDisplay, setDrawerDisplay] = useState<boolean>(false);

  const checkLoginStatus = () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/check_login`;
    const config = { withCredentials: true };
    axios.get(url, config).then(res => {
      if (res.data.logged_in === true) {
        setLoginState(true);
        setCurrentUser(res.data.user);
      } else {
        setCurrentUser({});
      }
    }).catch(res => {
      console.log("error :", res);
    })
  };
  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <>
      <Router>
        <LoginStateContext.Provider value={{ loginState, setLoginState }}>
          <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
            <UserContext.Provider value={{ user, setUser }}>
              <FollowOrNotContext.Provider value={{ followOrNot, setFollowOrNot }}>
                <MessageContext.Provider value={{ message, setMessage }}>
                  <AlertDisplayContext.Provider value={{ alertDisplay, setAlertDisplay }}>
                    <AlertSeverityContext.Provider value={{ alertSeverity, setAlertSeverity }}>
                      <DrawerContext.Provider value={{ drawerDisplay, setDrawerDisplay }}>
                        <HomeBase />
                      </DrawerContext.Provider>
                    </AlertSeverityContext.Provider>
                  </AlertDisplayContext.Provider>
                </MessageContext.Provider>
              </FollowOrNotContext.Provider>
            </UserContext.Provider>
          </CurrentUserContext.Provider>
        </LoginStateContext.Provider>
      </Router>
    </>
  );

}

export default App;
