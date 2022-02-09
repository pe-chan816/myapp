import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import { Avatar, Button, Grid, makeStyles, TextField, Tooltip } from '@material-ui/core';
import ImageIcon from '@material-ui/icons/Image';
import PersonIcon from '@material-ui/icons/Person';

import DeleteUserAccount from "./deleteUserAccount";
import SubmitButton from "common/submitButton";

import { AlertDisplayContext, AlertSeverityContext, CurrentUserContext, MessageContext } from "App";
import { AlertSeverityType } from "types/typeList";

const UpdateUserSettings = () => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  const [name, setName] = useState<string | undefined>();
  const [image, setImage] = useState<File>();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [passwordConfirmation, setPasswordConfirmation] = useState<string | undefined>();
  const [selfIntroduction, setSelfIntroduction] = useState<string | undefined>();
  const [uniqueName, setUniqueName] = useState<string | undefined>();

  const [preview, setPreview] = useState<string>("");
  const history = useHistory();

  const { setAlertDisplay } = useContext(AlertDisplayContext);
  const { setAlertSeverity } = useContext(AlertSeverityContext);
  const { setMessage } = useContext(MessageContext);
  const makeAlert = (alertSeverity: AlertSeverityType, message: string[]) => {
    setAlertDisplay(true);
    setAlertSeverity(alertSeverity);
    setMessage(message);
  };

  const useStyles = makeStyles({
    box: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
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
    },
    phrase: {
      fontSize: "13px",
      marginTop: "70px",
      textAlign: "center"
    }
  });
  const classes = useStyles();

  const setInitialValue = () => {
    setName(currentUser.name);
    setSelfIntroduction(currentUser.self_introduction);
    setUniqueName(currentUser.unique_name);
  };
  useEffect(() => { setInitialValue() }, []);

  const handleSubmit = async (e: any) => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/users/${currentUser.id}`;
    const data = await imageData();
    const config = {
      withCredentials: true,
      headers: { 'content-type': 'multipart/form-data' }
    };
    console.log(data);
    axios.patch(url, data, config).then(res => {
      if (res.data.user) {
        setCurrentUser(res.data.user);
        history.push(`/user/${currentUser.id}`);
        makeAlert("success", ["アカウント設定を変更しました"]);
      } else {
        console.log(res);
        makeAlert("error", [res.data.messages]);
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
    if (selfIntroduction) { fd.append("user[self_introduction]", selfIntroduction) };
    if (uniqueName) { fd.append("user[unique_name]", uniqueName) };
    return fd;
  };

  const currentUserImage = () => {
    if (!preview) {
      return (
        <Avatar alt="user-image"
          src={`${process.env.REACT_APP_IMAGE_URL}${currentUser.profile_image?.url}`}
        >
          <PersonIcon color="inherit" fontSize="large" />
        </Avatar>
      );
    };
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
              <Tooltip title="プロフィール画像">
                <Button component="span" size="small">
                  <ImageIcon fontSize="small" />
                </Button>
              </Tooltip>
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
          label="Unique Name"
          onChange={(e) => setUniqueName(e.target.value)}
          placeholder={`${currentUser.unique_name}`}
          type="text"
          value={uniqueName}
        />
        <TextField
          className={classes.form}
          label="Profile"
          onChange={(e) => setSelfIntroduction(e.target.value)}
          placeholder={`${currentUser.self_introduction}`}
          type="text"
          value={selfIntroduction}
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

        <SubmitButton label="編集"
          message="正式なアカウントを作成するとこの編集機能をご利用いただけます" />
      </form>


      <div className={classes.box}>
        <p className={classes.phrase}>
          もしこのアプリにご満足いただけなかったのであれば<br />
          アカウントを削除してしまうことも可能です
        </p>
        <DeleteUserAccount />
      </div>
    </div>
  );
}

export default UpdateUserSettings;
