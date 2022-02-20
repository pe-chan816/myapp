import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { Button, Grid, makeStyles, TextField, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import LabelIcon from '@material-ui/icons/Label';
import ImageIcon from '@material-ui/icons/Image';
import SendIcon from '@material-ui/icons/Send';

import { AlertDisplayContext, AlertSeverityContext, MessageContext } from "App";
import { AlertSeverityType } from "types/typeList";


const TweetForm = () => {
  const [content, setContent] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");
  const [hashtag, setHashtag] = useState<string[]>([]);
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string>("");
  const [tagDisplay, setTagDisplay] = useState<boolean>(false);
  const history = useHistory();
  const useStyles = makeStyles({
    error: {
      color: "firebrick"
    },
    formField: {
      width: "100%"
    },
    formFieldWrapper: {
      maxWidth: "800px",
      width: "80%"
    },
    preview: {
      maxWidth: "600px",
      maxHeight: "600px",
      width: "100%"
    }
  });
  const classes = useStyles();

  const { setAlertDisplay } = useContext(AlertDisplayContext);
  const { setAlertSeverity } = useContext(AlertSeverityContext);
  const { setMessage } = useContext(MessageContext);
  const makeAlert = (alertSeverity: AlertSeverityType, message: string[]) => {
    setAlertDisplay(true);
    setAlertSeverity(alertSeverity);
    setMessage(message);
  };

  const clickSubmit = async () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}/tweets`;
    const data = await tweetData();
    const config = {
      withCredentials: true,
      headers: { 'content-type': 'multipart/form-data' }
    };
    await axios.post(url, data, config).then(res => {
      history.push("/");
      makeAlert("success", ["ポスト投稿完了！"]);
    }).catch(error => {
      console.log("error :", error);
      makeAlert("error", ["ポスト内容が空のままです"])
    });
  };

  const tweetData = async () => {
    const fd = new FormData();
    if (content) { fd.append("tweet[content]", content) };
    if (image) { fd.append("tweet[tweet_image]", image) };
    if (hashtag) {
      const sendHashtag = hashtag.join(",");
      fd.append("hashtag", sendHashtag)
    };
    return fd;
  };

  const InputTag = () => {
    const clickInputTagButton = () => {
      setHashtag(hashtag => [...hashtag, newTag])
      setNewTag("");
    };

    return (
      <div>
        <Grid alignItems="flex-end"
          container
          direction="row"
          justifyContent="center"
        >
          <Grid item>
            <TextField
              label="ハッシュタグ"
              placeholder="# は不要です"
              onChange={e => setNewTag(e.target.value)}
              type="text"
              value={newTag}
            />
          </Grid>
          <Grid item>
            {newTag !== "" &&
              <Button data-testid="AddIcon" onClick={clickInputTagButton}>
                <AddIcon fontSize="small" />
              </Button>
            }
            {newTag === "" &&
              <Button data-testid="disAddIcon" disabled onClick={clickInputTagButton}>
                <AddIcon fontSize="small" />
              </Button>
            }
          </Grid>
        </Grid>
      </div>
    );
  };

  const hashtagForm = InputTag();

  const hashtags = hashtag.map((e, i) => {
    const clickDeleteButton = () => {
      const result = hashtag.filter(h => h !== e);
      setHashtag(result);
    };

    return (
      <Grid key={i} item>
        #{e}
        <Button data-testid="CloseIcon" onClick={clickDeleteButton}>
          <CloseIcon fontSize="small" />
        </Button>
      </Grid>
    );
  });

  return (
    <div>
      <Grid alignItems="center"
        container
        direction="column"
        justifyContent="center"
      >
        <Grid className={classes.formFieldWrapper} item>
          <Grid item>
            <TextField
              className={classes.formField}
              multiline
              placeholder="何かつぶやいてみましょう"
              onChange={e => setContent(e.target.value)}
              type="text"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Grid container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              {hashtags}
            </Grid>
          </Grid>
          <Grid item>
            {tagDisplay &&
              hashtagForm
            }
          </Grid>
          <Grid alignItems="center"
            container
            direction="row"
            justifyContent="space-evenly"
          >
            <Grid item>
              <Tooltip title="画像添付">
                <label htmlFor="image-upload">
                  <Button component="span" data-testid="ImageIcon" size="small">
                    <ImageIcon fontSize="small" />
                  </Button>
                </label>
              </Tooltip>
              <input
                onChange={(e) => {
                  const limitSize = 1024 * 1024 * 1;

                  if (e.target.files) {
                    const file = e.target.files[0];

                    if (file.size <= limitSize) {
                      setImage(e.target.files[0]);
                      setPreview(window.URL.createObjectURL(e.target.files[0]));
                    } else {
                      makeAlert("error", ["ファイルサイズは 1024 * 1024 までとなります"]);
                      setImage(undefined);
                      setPreview("");
                    }
                  }
                }}
                id="image-upload"
                hidden
                type="file"
              />
            </Grid>
            <Grid item>
              <Tooltip title="ハッシュタグ">
                <Button data-testid="LabelIcon" onClick={() => setTagDisplay(!tagDisplay)} size="small">
                  <LabelIcon fontSize="small" />
                </Button>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="投稿">
                <Button data-testid="SendIcon" onClick={clickSubmit} >
                  <SendIcon />
                </Button>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          {preview &&
            <img className={classes.preview} src={preview} alt="preview" />
          }
        </Grid>
      </Grid>
    </div >
  );
};

export default TweetForm;
