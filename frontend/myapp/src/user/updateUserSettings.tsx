import { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import { Avatar, Button, Grid, makeStyles, TextField } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';

import DeleteUserAccount from "./deleteUserAccount";
import SubmitButton from "common/submitButton";

import { CurrentUserContext } from "App";
import { MessageContext } from "App";


const UpdateUserSettings = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const { setMessage } = useContext(MessageContext);

  const [name, setName] = useState(currentUser.name);
  const [image, setImage] = useState<File>();
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [preview, setPreview] = useState<string>("");
  const history = useHistory();

  const useStyles = makeStyles({
    form: {
      width: "100%",
      marginTop: 5
    },
    paper: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      margin: "0 auto",
      width: "60%"
    }
  });
  const classes = useStyles();

  const handleSubmit = async (e: any) => {
    const url = `http://localhost:3000/users/${currentUser.id}`;
    const data = await imageData();
    const config = {
      withCredentials: true,
      headers: { 'content-type': 'multipart/form-data' }
    };
    console.log(data);
    axios.patch(url, data, config).then(res => {
      if (res.data.user) {
        setCurrentUser(res.data.user);
        history.push("/user/edit/account");
      } else {
        console.log(res);
        res.data.messages.forEach((e: string) => setMessage((message: string[]) => [...message, e]));
      }
    }).catch(error => {
      console.log("error->", error);
    });

    e.preventDefault();
  }

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
        <Avatar alt="profile-image"
          src={`http://localhost:3000/${currentUser.profile_image?.url}`} />
      );
    }
  };
  const newUserImage = () => {
    if (preview) {
      return (
        <Avatar alt="new-profile-image" src={preview} />
      );
    }
  };

  return (
    <div className={classes.paper}>
      <h3>ユーザーアカウント設定</h3>
      <form className={classes.paper} onSubmit={handleSubmit}>

        <Grid
          alignItems="center"
          container
          direction="row"
          justifyContent="flex-start"
          spacing={1}
        >
          <Grid item>
            {currentUserImage()}
            {newUserImage()}
          </Grid>
          <Grid item>
            <label htmlFor="image-upload">
              <Button component="span" size="small">
                <ImageIcon fontSize="small" />
              </Button>
            </label>
            <input
              onChange={(e) => {
                if (e.target.files) {
                  setImage(e.target.files[0]);
                  setPreview(window.URL.createObjectURL(e.target.files[0]));
                }
              }}
              id="image-upload"
              hidden
              type="file" />
          </Grid>
        </Grid>

        <TextField
          className={classes.form}
          label="Name"
          onChange={(e) => setName(e.target.value)}
          placeholder={`${currentUser.name}`}
          type="text"
          value={name}
        />
        <TextField
          className={classes.form}
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder={`${currentUser.email}`}
          type="email"
          value={email}
        />
        <TextField
          className={classes.form}
          label="Password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="新しいパスワード"
          type="password"
          value={password}
        />
        {password &&
          <TextField
            className={classes.form}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="パスワードをもう一度入力してください"
            type="password"
            value={passwordConfirmation}
          />
        }

        <SubmitButton label="編集" />
      </form>

      <DeleteUserAccount />
    </div>
  );
}

export default UpdateUserSettings;
