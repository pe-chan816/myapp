import { useState, useContext } from "react";
import axios from "axios";

import { LoginStateContext } from "App";
import { CurrentUserContext } from "App";
import { MessageContext } from "App";


const UpdateUserSettings = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { setLoginState } = useContext(LoginStateContext);
  const { setMessage } = useContext(MessageContext);

  const [name, setName] = useState(currentUser.name);
  const [image, setImage] = useState<File>();
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [preview, setPreview] = useState<string>("");

  const handleSubmit = async (e: any) => {
    const url = `http://localhost:3000/users/${currentUser.id}`;
    const data = await imageData();
    const config = {
      withCredentials: true,
      headers: { 'content-type': 'multipart/form-data' }
    };
    console.log(data);
    axios.patch(url, data, config).then(response => {
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

  const deleteAccount = () => {
    const confirm = window.confirm(`本当に ${currentUser.name} のアカウントを削除しますか？`);
    if (confirm) {
      const url = `http://localhost:3000/users/${currentUser.id}`;
      const config = { withCredentials: true };
      axios.delete(url, config).then(res => {
        console.log(res)
        setCurrentUser({});
        setLoginState(false);
        window.location.replace(`http://localhost:8000`)
      });
    };
  };

  const imageData = async () => {
    const fd = new FormData();
    if (name) { fd.append("user[name]", name); };
    if (image) { fd.append("user[profile_image]", image); };
    if (email) { fd.append("user[email]", email) };
    if (password) { fd.append("user[password]", password) };
    if (passwordConfirmation) { fd.append("user[password_confirmation]", passwordConfirmation) };
    return fd;
  };

  const currentUserImage = () => {
    if (!preview && currentUser.profile_image?.url) {
      return (
        <img src={`http://localhost:3000/${currentUser.profile_image?.url}`} alt="profile" />
      );
    }
  };

  return (
    <div>
      <h3>ユーザーアカウント設定</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <span>名前 : </span>
          <input
            name="name"
            type="text"
            placeholder={`${currentUser.name}`}
            onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <span>プロフィール画像 : </span>
          <input
            name="image"
            type="file"
            onChange={(e) => {
              if (e.target.files) {
                setImage(e.target.files[0]);
                setPreview(window.URL.createObjectURL(e.target.files[0]));
              }
            }} />
          {currentUserImage()}
          {preview && <img src={preview} alt="profile" />}
        </div>
        <div>
          <span>Email : </span>
          <input
            name="email"
            type="email"
            placeholder={`${currentUser.email}`}
            onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <span>パスワード : </span>
          <input
            name="password"
            type="password"
            placeholder="新しいパスワード"
            onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <span>パスワード確認 : </span>
          <input
            name="passwordConfirmation"
            type="password"
            placeholder="パスワードをもう一度入力してください"
            onChange={(e) => setPasswordConfirmation(e.target.value)} />
        </div>
        <button type="submit">編集</button>
      </form>

      <button onClick={deleteAccount}>アカウント削除</button>
    </div>
  );
}

export default UpdateUserSettings;
