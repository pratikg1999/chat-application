import "./ChatBox.css";
import Message from "../Message/Message";

function ChatBox(props) {
  const { conversation, editMessage, deleteMessage, loggedInUserId } = props;
  return (
    <div className="chatbox">
      {conversation.messages.map((message) => {
        return (
          !message.isDeleted && (
            <Message
              key={message._id}
              message={message}
              editMessage={editMessage}
              deleteMessage={deleteMessage}
              loggedInUserId={loggedInUserId}
            />
          )
        );
      })}
    </div>
  );
}

export default ChatBox;
