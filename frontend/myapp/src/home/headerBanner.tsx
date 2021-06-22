import React, { useState, useContext, createContext, useReducer } from 'react';
import { ModalShowContext } from 'App';

const HeaderBanner = () => {
  const { show, dispatch } = useContext(ModalShowContext);

  return (
    <div className="header-banner">
      <a href="">Insyutagram</a>
      <nav>
        <button onClick={() => dispatch()}>ログイン</button>
        <button>アカウント作成</button>
      </nav>
    </div>
  );
}

export default HeaderBanner;
