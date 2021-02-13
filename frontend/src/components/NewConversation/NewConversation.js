import PropTypes from "prop-types";
import { setActiveConversation } from "../../actions/conversationActions";
import { getAllUsers } from "../../actions/userActions";
import { connect } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import styles from "./NewConversation.module.css";

const UsersList = (props) => {};

const filterUsers = (users, searchText) => {
  if (searchText.trim() == "") {
    return users;
  }
  searchText = searchText.toLowerCase();
  const ans = users.filter((user) => {
    return (
      user.firstName.toLowerCase().includes(searchText) ||
      user.lastName.toLowerCase().includes(searchText) ||
      (user.firstName + " " + user.lastName).toLowerCase().includes(searchText)
    );
  });
  return ans;
};

const NewConversation = (props) => {
  const [searchText, setSearchtext] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    props.getAllUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(props.users);
  }, [props.users]);

  return (
    <div className={`d-flex flex-column align-items-stretch w-100`}>
      <div className="mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search for users"
          value={searchText}
          onChange={async (e) => {
            await setSearchtext(e.target.value);
            setFilteredUsers(filterUsers(props.users, e.target.value));
          }}
        />
      </div>
      <div
        className={`overflow-scroll ${styles.vh50} d-flex flex-column align-items-stretch`}
      >
        {filteredUsers.map((user) => {
          return (
            <div
              key={user._id}
              className={`d-flex align-items-center p-2 ${styles.user}`}
              onClick={() => {
                props.setActiveConversation(user);
                props.setModalShow(false);
              }}
            >
              <div className={`pr-1`}>
                <img
                  className="rounded"
                  src={user.avatar}
                  alt="avatar"
                  width="25"
                  height="25"
                />
              </div>
              <div>{user.firstName + " " + user.lastName}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

NewConversation.propTypes = {
  users: PropTypes.array.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  setActiveConversation: PropTypes.func.isRequired,
  setModalShow: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  users: state.usersData.users,
});

export default connect(mapStateToProps, { getAllUsers, setActiveConversation })(
  NewConversation
);
