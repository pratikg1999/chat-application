import "./RightPanel.css";
import ChatBox from "../ChatBox/ChatBox";
import Messenger from "../Messenger/Messenger";

function RightPanel(props) {
  const {
    conversation,
    editMessage,
    deleteMessage,
    sendMessage,
    loggedInUser,
    sendTyping,
    uploadAttachment,
  } = props;
  let dateString = "";
  if (conversation.receiver.status === "offline") {
    const date = new Date(conversation.receiver.lastSeen);
    dateString = " Last seen : " + date.toString();
  }
  return (
    <div className="rightPanel">
      <div className="p-2 border-bottom shadow text-left">
        <div className="username row">
          <img
            className="chat-avatar rounded"
            src={conversation.receiver.avatar}
            alt="Avatar"
          />
          <div className="col">
            {conversation.receiver.firstName} {conversation.receiver.lastName}
            <br />
            {conversation.receiver.status === "offline" && (
              <span className="text-secondary small">{dateString}</span>
            )}
            {conversation.receiver.status === "online" && (
              <span className="text-secondary small">online</span>
            )}
          </div>
        </div>
      </div>
      <ChatBox
        conversation={conversation}
        editMessage={editMessage}
        deleteMessage={deleteMessage}
        loggedInUserId={loggedInUser._id}
      />
      <Messenger
        sendMessage={sendMessage}
        sender={loggedInUser}
        sendTyping={sendTyping}
        receiver={conversation.receiver}
        uploadAttachment={uploadAttachment}
      />
    </div>
  );
}

export default RightPanel;
