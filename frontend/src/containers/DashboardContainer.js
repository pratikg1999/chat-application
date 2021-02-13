import React, { Component } from "react";
import Navbar from "../components/Common/Navbar/Navbar";
import { logoutUser } from "../actions/authActions";
import { setUpSocket, sendTyping } from "../actions/socketActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  editMessage,
  deleteMessage,
  sendMessage,
  getConversations,
  updateMyStatus,
  uploadAttachment,
  clearConversations,
} from "../actions/conversationActions";
import { clearAuth } from "../actions/authActions";
import { clearUsers } from "../actions/userActions";
import LeftPanel from "../components/Dashboard/LeftPanel/LeftPanel";
import RightPanel from "../components/Dashboard/RightPanel/RightPanel";
import { SOCKET_URL } from "../Socket";

class DashboardContainer extends Component {
  constructor() {
    super();
    this.logoutUser = this.logoutUser.bind(this);
  }

  componentDidMount() {
    let user;
    if (this.props.auth) {
      user = JSON.parse(localStorage.getItem("user"));
    } else {
      user = this.props.auth.user;
    }
    user.status = "online";
    this.props.updateMyStatus(user);
    this.props.setUpSocket(SOCKET_URL);
  }

  componentWillUnmount() {
    this.props.clearAuth();
    this.props.clearConversations();
    this.props.clearUsers();
  }

  logoutUser() {
    this.props.logoutUser(this.props.history);
  }

  render() {
    const { user } = this.props.auth;
    const { conversations, activeConversation } = this.props.conversationsData;
    const conversation = conversations[activeConversation];
    if (conversation !== null && conversation !== undefined) {
      conversation.messages.map((message) => {
        if (message.receiver === user._id && message.readStatus !== "seen") {
          message = { ...message };
          message.readStatus = "seen";
          this.props.editMessage(message);
        }
      });
    }
    return (
      <div>
        <div className="navbar-area m-0">
          <Navbar user={user} logout={this.logoutUser} />
        </div>
        <div className="row content-area m-0">
          <div className="col-2 m-0 p-0">
            <LeftPanel />
          </div>
          <div className="col-10 m-0 p-0">
            {conversation ? (
              <RightPanel
                conversation={conversation}
                loggedInUser={this.props.auth.user}
                sendMessage={this.props.sendMessage}
                editMessage={this.props.editMessage}
                deleteMessage={this.props.deleteMessage}
                sendTyping={this.props.sendTyping}
                uploadAttachment={this.props.uploadAttachment}
              />
            ) : (
              <div
                className={`d-flex flex-grow-1 align-items-center justify-center`}
              >
                <p className="text-secondary">
                  Click on a conversation or start a new one
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

DashboardContainer.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  editMessage: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  getConversations: PropTypes.func.isRequired,
  setUpSocket: PropTypes.func.isRequired,
  clearAuth: PropTypes.func.isRequired,
  clearConversations: PropTypes.func.isRequired,
  clearUsers: PropTypes.func.isRequired,
  updateMyStatus: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  conversationsData: state.conversationsData,
});

export default connect(mapStateToProps, {
  logoutUser,
  setUpSocket,
  getConversations,
  editMessage,
  sendMessage,
  deleteMessage,
  updateMyStatus,
  sendTyping,
  uploadAttachment,
  clearAuth,
  clearConversations,
  clearUsers,
})(DashboardContainer);
