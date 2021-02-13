import { connect } from "react-redux";
import { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./LeftPanel.module.css";
import typingIcon from "../../../assets/images/typing.gif";
import { Modal, Button } from "react-bootstrap";
import { setActiveConversation } from "../../../actions/conversationActions";
import NewConversation from "../../NewConversation/NewConversation";

const ConversationsList = ({
  conversations,
  activeConversation,
  setActiveConversation,
}) => {
  return Object.values(conversations).map((conversation) => (
    <div
      className={classNames("d-flex mb-1 p-2 border-bottom", {
        [styles.conversation]: true,
        [styles.selected]: activeConversation === conversation.receiver._id,
        [styles.nonSelected]: activeConversation !== conversation.receiver._id,
      })}
      key={conversation.receiver._id}
      onClick={() => {
        setActiveConversation(conversation.receiver);
      }}
    >
      <div className="mr-1">
        {conversation.receiver.status === "online" ? (
          <i className="status online fas fa-circle" aria-hidden="true"></i>
        ) : (
          <i className="status offline fas fa-circle" aria-hidden="true"></i>
        )}
      </div>
      <div className={`pr-1`}>
        {conversation.receiver.isTyping ? (
          <img
            className="rounded"
            src={typingIcon}
            alt="avatar"
            width="25"
            height="25"
          />
        ) : (
          <img
            className="rounded"
            src={conversation.receiver.avatar}
            alt="avatar"
            width="25"
            height="25"
          />
        )}
      </div>
      <div>{conversation.receiver.firstName}</div>
      <div className={`flex-grow-1`}></div>
      <div className={`${styles.unreadCount}`}>
        <small>{conversation.unreadCount}</small>
      </div>
    </div>
  ));
};

ConversationsList.propTypes = {
  conversations: PropTypes.object.isRequired,
  activeConversation: PropTypes.string.isRequired,
  setActiveConversation: PropTypes.func.isRequired,
};

const LeftPanel = (props) => {
  const [modalShow, setModalShow] = useState(false);
  const { conversations, activeConversation } = props.conversationsData;
  return (
    <>
      <div
        className={`d-flex flex-column align-items-stretch slack-bg-color text-white`}
      >
        <div className={`overflow-scroll flex-grow-1 ${styles.leftPanel}`}>
          {conversations && Object.values(conversations).length > 0 ? (
            <ConversationsList
              conversations={conversations}
              activeConversation={activeConversation}
              setActiveConversation={props.setActiveConversation}
            />
          ) : (
            <div className="h-100 d-flex justify-center align-items-center">
              <p className="px-3 text-secondary">
                Click on "New Chat" to start messaging
              </p>
            </div>
          )}
        </div>
        <div className={`px-2`}>
          <button
            type="submit"
            onClick={(e) => {
              setModalShow(true);
            }}
            className={`btn btn-block navbar-color mt-3 mb-2 ${styles.newChatButton}`}
          >
            New Chat
          </button>
        </div>
      </div>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Connection
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewConversation setModalShow={setModalShow} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setModalShow(false)}>Close</Button>
          <Button onClick={() => {}}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  conversationsData: state.conversationsData,
});

LeftPanel.propTypes = {
  conversationsData: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { setActiveConversation })(LeftPanel);
