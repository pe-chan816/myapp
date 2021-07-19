import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const TweetForm = () => {
  console.log("!!TweetForm!!");

  const [content, setContent] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");
  const [hashtag, setHashtag] = useState<string[]>([]);
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string>("");

  const [message, setMessage] = useState<string>("");
  const history = useHistory();

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

  const inputTag = () => {
    const clickInputTagButton = () => {
      setHashtag(hashtag => [...hashtag, newTag])
      setNewTag("");
    };

    const hashtags = hashtag.map((e, i) => {
      const clickDeleteButton = () => {
        const result = hashtag.filter(h => h !== e);
        setHashtag(result);
      };

      return (
        <div key={i}>
          <p>#{e}<button onClick={clickDeleteButton}>x</button></p>
        </div>
      );
    });

    return (
      <div>
        <div>{hashtags}</div>
        <input
          name="tag"
          type="text"
          placeholder="ハッシュタグ"
          onChange={e => setNewTag(e.target.value)}
          value={newTag} />
        <button onClick={clickInputTagButton}>追加</button>
      </div>
    );
  };

  const hashtagForm = inputTag();

  console.log(content);

  return (
    <div>
      <input
        name="content"
        type="text"
        placeholder="何かつぶやいてみましょう"
        onChange={e => setContent(e.target.value)} />
      {hashtagForm}
      <input
        name="image"
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            setImage(e.target.files[0]);
            setPreview(window.URL.createObjectURL(e.target.files[0]));
          }
        }} />
      {preview && <img src={preview} alt="preview" />}
      <button onClick={clickSubmit}>投稿</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TweetForm;
