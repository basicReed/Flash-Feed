import React, { useState } from "react";
import "./PostForm.css";
import FlashFeedApi from "./Api";

const PostForm = ({ onPost }) => {
  const [txtContent, setTextContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleTextChange = (event) => {
    setTextContent(event.target.value);
  };

  const handlePrivateChange = (event) => {
    setIsPrivate(event.target.checked);
  };

  const handlePost = async () => {
    try {
      let post = await FlashFeedApi.post(txtContent, isPrivate);
      onPost(post);
    } catch (err) {
      console.log(err);
    }
    setTextContent("");
    setIsPrivate(false);
  };

  return (
    <div className="post-form">
      <textarea
        placeholder="What's up?"
        value={txtContent}
        onChange={handleTextChange}
      />
      <div className="post-form-options">
        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={handlePrivateChange}
          />
          Private
        </label>
      </div>
      <button onClick={handlePost}>Post</button>
    </div>
  );
};

export default PostForm;
