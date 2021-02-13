import { useState, useRef } from "react";
import styles from "./Messenger.module.css";
import PropTypes from "prop-types";

function Messenger(props) {
  const { sendMessage, sender, receiver, sendTyping, uploadAttachment } = props;
  const attachmentInput = useRef(null);
  const [attachment, setAttachment] = useState("");
  const [text, setText] = useState("");

  const onChangeFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    setAttachment(file);
  };

  return (
    <div className={`border ${styles.messenger} px-2`}>
      <div className="px-2 d-flex flex-column align-items-stretch w-100 h-100">
        <div
          className={`flex-grow-1 d-flex flex-column align-items-stretch round-border`}
        >
          <div className={`flex-grow-1 ${styles.textAreaWrapper}`}>
            <textarea
              className="form-control"
              placeholder="Write your message"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                sendTyping(receiver._id);
              }}
            ></textarea>
          </div>
          <div className={`${styles.actions} d-flex p-1`}>
            {attachment && (
              <>
                <div>{attachment.name}</div>
                <button
                  type="button"
                  className={`btn ${styles.iconButton}`}
                  onClick={(e) => {
                    attachmentInput.current.value = "";
                    setAttachment(null);
                  }}
                >
                  <i className="fa fa-times" aria-hidden="true"></i>
                </button>
              </>
            )}
            <div className="flex-grow-1"></div>
            <input
              type="file"
              accept="image/x-png,image/gif,image/jpeg"
              ref={attachmentInput}
              style={{ display: "none" }}
              onChange={onChangeFile}
            />
            <button
              type="button"
              className={`btn ${styles.iconButton}`}
              onClick={(e) => {
                attachmentInput.current.click();
              }}
            >
              <i className="fa fa-paperclip" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              className={`btn btn-success ${styles.iconButton}`}
              onClick={async (e) => {
                let attUrl = null;
                if (attachment) {
                  attUrl = await uploadAttachment(attachment);
                }
                sendMessage({
                  sender: sender,
                  receiver: receiver._id,
                  attachmentUrl: attUrl,
                  readStatus: "process",
                  isDeleted: false,
                  text: text,
                });
                setText("");
                attachmentInput.current.value = "";
                setAttachment(null);
              }}
            >
              <i className="fa fa-paper-plane" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div className={`d-flex pl-2`}>
          {receiver.isTyping && (
            <small>
              <b>{receiver.firstName}</b> is typing
            </small>
          )}
          <div className="flex-grow-1"></div>
          <small>
            <b>Return </b> to send
          </small>
        </div>
      </div>
    </div>
  );
}

export default Messenger;
