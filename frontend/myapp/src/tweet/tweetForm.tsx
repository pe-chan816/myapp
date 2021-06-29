import { useState } from "react";

import axios from "axios";

const TweetForm = () => {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string>("");

  const handleSubmit = async () => {
    console.log("ツイート投稿");

    const url = `http://localhost:3000/tweets`;
    const data = await tweetData();
    const config = {
      withCredentials: true,
      headers: { 'content-type': 'multipart/form-data' }
    };

    await axios.post(url, data, config).then(response => {
      console.log(response);
    }).catch(error => {
      console.log("エラーがあります", error);
    });
  };

  const tweetData = async () => {
    const fd = new FormData();
    if (content) { fd.append("tweet[content]", content) };
    if (image) { fd.append("tweet[tweet_image]", image) };
    return fd;
  };

  return (
    <>
      <h1>TWEET FORM</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="content"
          type="text"
          placeholder="何かつぶやいてみましょう"
          onChange={e => setContent(e.target.value)} />
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
        <button type="submit">投稿</button>
      </form>
    </>
  );
};

export default TweetForm;
