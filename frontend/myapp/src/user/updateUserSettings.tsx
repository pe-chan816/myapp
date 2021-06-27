import { useState, useContext } from "react";
import axios from "axios";

import { CurrentUserContext } from "App";
import { MessageContext } from "App";


const UpdateUserSettings = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { message, setMessage } = useContext(MessageContext);

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSubmit = (e: any) => {
    axios.patch(`http://localhost:3000/users/${currentUser.id}`, {
      user: {
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation
      }
    }, { withCredentials: true }).then(response => {
      if (response.data.user) {
        setCurrentUser(response.data.user);
        console.log(response);
      } else {
        console.log(response);
        response.data.messages.forEach((e: string) => setMessage((message: string[]) => [...message, e]));
      }
    }).catch(error => {
      console.log(error, "エラーがあるよ")
    });

    e.preventDefault();
  }

  return (
    <div>
      <h1>UPDATE USER SETTING</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder={`${currentUser.name}`}
          onChange={(e) => setName(e.target.value)} />
        <input
          name="email"
          type="email"
          placeholder={`${currentUser.email}`}
          onChange={(e) => setEmail(e.target.value)} />
        <input
          name="password"
          type="password"
          placeholder="新しいパスワード"
          onChange={(e) => setPassword(e.target.value)} />
        <input
          name="passwordConfirmation"
          type="password"
          placeholder="パスワードをもう一度入力してください"
          onChange={(e) => setPasswordConfirmation(e.target.value)} />
        <button type="submit">編集</button>
      </form>
    </div>
  );
}

export default UpdateUserSettings;
