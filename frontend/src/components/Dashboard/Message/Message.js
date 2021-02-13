import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../../../axiosInstance";
import TextAreaFieldGroup from "../../Common/FormElements/TextAreaFieldGroup";
import "./Message.css";

function getTime(createdAt) {
  const date = new Date(createdAt);
  let hrs = date.getHours();
  let min = date.getMinutes();
  if (min < 10) {
    min = "0" + min;
  }
  if (hrs >= 12) {
    hrs = hrs % 12;
    if (hrs < 10) {
      hrs = "0" + hrs;
    }
    return hrs + ":" + min + " PM";
  } else {
    if (hrs < 10) {
      hrs = "0" + hrs;
    }
    return hrs + ":" + min + " AM";
  }
}

function Message(props) {
  const { message, editMessage, deleteMessage, loggedInUserId } = props;
  const [modalShow, setModalShow] = useState(false);
  const [text, setText] = useState(message.text);
  const time = getTime(message.createdAt);

  function DeleteClick() {
    let newMessage = { ...message };
    newMessage.isDeleted = true;
    console.log("change message", newMessage);
    deleteMessage(newMessage);
  }

  function CloseModal() {
    setModalShow(false);
  }

  function SaveMessage() {
    let newMessage = { ...message };
    newMessage.text = text;
    console.log("change message", newMessage);
    editMessage(newMessage);
    CloseModal();
  }
  return (
    <div className="text-left message">
      <div className="row">
        <div className="p-2 text-right">
          <img
            className="message-avatar rounded"
            src={message.sender.avatar}
            alt="Avatar"
          />
        </div>
        <div className="col">
          <div className="row">
            <span className="username">
              {message.sender.firstName + " " + message.sender.lastName}
            </span>
            <span className="time">{time}</span>
            <span className="readIcon">
              {message.readStatus === "process" && (
                <i className="fas fa-clock-o" aria-hidden="true"></i>
              )}
              {message.readStatus === "sent" && (
                <i className="fas fa-check" aria-hidden="true"></i>
              )}
              {message.readStatus === "delivered" && (
                <i className="fas fa-check-double" aria-hidden="true"></i>
              )}
              {message.readStatus === "seen" && (
                <i
                  className="fas fa-check-double text-info"
                  aria-hidden="true"
                ></i>
              )}
            </span>
            <div className="col">
              {message.sender._id === loggedInUserId && (
                <div className="float-right dropleft">
                  <button
                    type="button"
                    className="edit-icon btn btn-light"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                  </button>
                  <div className="dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => setModalShow(true)}
                    >
                      Edit Message
                    </button>
                    <Modal
                      show={modalShow}
                      onHide={CloseModal}
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                          Edit Message
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="row px-2">
                          <div className="col-3 text-right">Message :</div>
                          <div className="col-8">
                            <TextAreaFieldGroup
                              className="w-100"
                              id="message"
                              placeholder="Message"
                              name="text"
                              value={text}
                              onChange={(e) => {
                                setText(e.target.value);
                              }}
                            />
                          </div>
                        </div>
                        {message.attachmentUrl &&
                        message.attachmentUrl !== null &&
                        message.attachmentUrl !== "" ? (
                          <div className="row px-2">
                            <div className="col-3 text-right">Attachment :</div>
                            <div className="col-8">
                              <img
                                className="attachment rounded"
                                src={
                                  axiosInstance.defaults.baseURL +
                                  "/" +
                                  message.attachmentUrl
                                }
                                alt="Attachment"
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button onClick={CloseModal}>Close</Button>
                        <Button onClick={SaveMessage}>Save</Button>
                      </Modal.Footer>
                    </Modal>
                    <button
                      className="dropdown-item"
                      onClick={DeleteClick.bind(this, message)}
                    >
                      Delete Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="row px-2">
            <p className="m-0">{message.text}</p>
          </div>
          {message.attachmentUrl &&
          message.attachmentUrl !== null &&
          message.attachmentUrl !== "" ? (
            <div className="row px-2">
              <img
                src={
                  axiosInstance.defaults.baseURL + "/" + message.attachmentUrl
                }
                className="attachment rounded"
                alt="Attachment"
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
