import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { Button, Grid, makeStyles, TextField, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import LabelIcon from '@material-ui/icons/Label';
import ImageIcon from '@material-ui/icons/Image';
import SendIcon from '@material-ui/icons/Send';

const TweetForm = () => {
  console.log("!!TweetForm!!");

  const [content, setContent] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");
  const [hashtag, setHashtag] = useState<string[]>([]);
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string>("");
  const [message, setMessage] = useState<string>("");
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
      width: "60%"
    }
  });
  const classes = useStyles();

  const clickSubmit = async () => {
    console.log("ツイート投稿");

    setMessage("");

    const url = `http://localhost:3000/tweets`;
    const data = await tweetData();
    const config = {
      withCredentials: true,
      headers: { 'content-type': 'multipart/form-data' }
    };
    await axios.post(url, data, config).then(res => {
      console.log("res=>", res);
      history.push("/");
    }).catch(error => {
      console.log("エラーがあります", error);
      setMessage("ツイートの中身が空のままです");
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

  console.log(content);
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
          <Grid item>
            {message &&
              <p className={classes.error}>{message}</p>
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
                  if (e.target.files) {
                    setImage(e.target.files[0]);
                    setPreview(window.URL.createObjectURL(e.target.files[0]));
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
            <img src={preview} alt="preview" />
          }
        </Grid>
      </Grid>
    </div >
  );
};

export default TweetForm;
