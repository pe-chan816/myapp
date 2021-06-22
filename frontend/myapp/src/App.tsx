import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default User;

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
