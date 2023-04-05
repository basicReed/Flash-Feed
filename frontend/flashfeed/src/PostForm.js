import React, { useState } from "react";
import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import "./PostForm.css";
import FlashFeedApi from "./Api";

const MAX_CHARACTERS = 1000;

const PostForm = ({ onPost }) => {
  const [txtContent, setTextContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleTextChange = (event) => {
    const value = event.target.value;
    if (value.length <= MAX_CHARACTERS) {
      setTextContent(value);
    }
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

  const remainingChars = MAX_CHARACTERS - txtContent.length;

  return (
    <div className="post-form">
      <GrammarlyEditorPlugin clientId="client_Ey7sNT8Qtf8v9eZMzZCTPF">
        <textarea
          placeholder="What's up?"
          value={txtContent}
          onChange={handleTextChange}
        />
      </GrammarlyEditorPlugin>
      <div className="post-form-options">
        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={handlePrivateChange}
          />
          Private
        </label>
        <span className="post-char-counter">{remainingChars}</span>
      </div>
      <button onClick={handlePost}>Post</button>
    </div>
  );
};

export default PostForm;
