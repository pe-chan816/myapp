import React, { useState, createContext, useReducer } from 'react';
import ModalField from 'common/modalField';
import HomeBase from 'home/homeBase';

const InitialModalStatus = false;

export const ModalShowContext = createContext({
  show: {},
  dispatch: () => { }
});

export const reducerFunction = (show: boolean) => {
  return !show;
}

const App = () => {
  const [show, dispatch] = useReducer(reducerFunction, InitialModalStatus);
  return (
    <>
      <ModalShowContext.Provider value={{ show, dispatch }}>
        <HomeBase />
        <ModalField />
      </ModalShowContext.Provider>
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
