import React, { useContext } from 'react';

import { LoginStateContext } from 'App';

import HomeHeader from 'home/homeHeader'
import NotLoginHomeHeader from './notLoginHomeHeader';

const HomeBase = () => {
  const { loginState, setLoginState } = useContext(LoginStateContext);

  if (loginState === true) {
    return (
      <>
        <HomeHeader />
      </>
    );
  } else {
    return (
      <>
        <NotLoginHomeHeader />
      </>
    );
  }
}

export default HomeBase;
