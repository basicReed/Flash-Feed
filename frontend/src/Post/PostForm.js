import React, { useState } from "react";
import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import "./PostForm.css";
import FlashFeedApi from "../Api";
import Picker from "@emoji-mart/react";

const MAX_CHARACTERS = 1000;

const PostForm = ({ onPost }) => {
  const [txtContent, setTextContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // update text content for each char if less than MAX_CHARACTERS
  const handleTextChange = (event) => {
    const value = event.target.value;
    if (value.length <= MAX_CHARACTERS) {
      setTextContent(value);
    }
  };

  // Make private
  const handlePrivateChange = (event) => {
    setIsPrivate(event.target.checked);
  };

  // POST
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

  // Append emoji
  const handleEmojiClick = (emoji) => {
    setTextContent(txtContent + emoji.native);
  };

  const remainingChars = MAX_CHARACTERS - txtContent.length;

  return (
    <div className="post-form">
      {/* POST TEXTBOX */}
      <GrammarlyEditorPlugin clientId="client_Ey7sNT8Qtf8v9eZMzZCTPF">
        <textarea
          placeholder="What's up?"
          value={txtContent}
          onChange={handleTextChange}
        />
      </GrammarlyEditorPlugin>
      <div className="post-form-options">
        {/* PICK EMOJIS */}
        <div className="emoji-container">
          <div
            className="far fa-smile"
            style={{ color: "#5b7083" }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
          {showEmojiPicker && (
            <div className="emoji-picker">
              <Picker
                className="emoji-picker"
                title="Pick your emoji…"
                emoji="point_up"
                emojiSize={20}
                showPreview={false}
                perLine={7}
                onEmojiSelect={(emoji) => handleEmojiClick(emoji)}
              />
            </div>
          )}
        </div>
        {/* MAKE POST PRIVATE */}
        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={handlePrivateChange}
          />
          Private
        </label>
        {/* CHAR COUNT for POST */}
        <span className="post-char-counter">{remainingChars}</span>
      </div>

      <button onClick={handlePost}>Post</button>
    </div>
  );
};

export default PostForm;
