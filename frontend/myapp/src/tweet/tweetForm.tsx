import { useState } from "react";
import axios from "axios";

const TweetForm = () => {
  const [content, setContent] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");
  const [hashtag, setHashtag] = useState<string[]>([]);
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string>("");

  const clickSubmit = async () => {
    console.log("ツイート投稿");

    const url = `http://localhost:3000/tweets`;
    const data = await tweetData();
    const config = {
      withCredentials: true,
      headers: { 'content-type': 'multipart/form-data' }
    };

    await axios.post(url, data, config).then(response => {
      console.log(response);
      window.location.replace(`http://localhost:8000/`);
    }).catch(error => {
      console.log("エラーがあります", error);
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
        <p>ここにハッシュタグ</p>
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

  console.log(hashtag);
  return (
    <div>
      <h1>TWEET FORM</h1>
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

    </div>
  );
};

export default TweetForm;
