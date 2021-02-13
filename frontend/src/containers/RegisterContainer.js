import React, { Component } from "react";
import logo from "../assets/images/logo.jpg";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../actions/authActions";
import TextFieldGroup from "../components/Common/FormElements/TextFieldGroup";
import { Link } from "react-router-dom";
class Register extends Component {
  constructor() {
    super();

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    // TODO : Handle password confirm password mismatch
    const user = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      mobile: this.state.mobile,
      password: this.state.password,
      lastSeen: null,
      status: "offline",
      connections: [],
    };
    this.props.registerUser(user, this.props.history);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <div className="register">
        <div className="container">
          <div className="row justify-content-center align-content-center occupy-window">
            <div className="col-md-6 m-auto">
              <div className="mb-5">
                <img className="logo-size rounded" src={logo} alt="Logo" />
                <span className="h2 text-center">Chat App</span>
              </div>
              <h1 className="text-center mb-5">Create Account</h1>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.onChange}
                />
                <TextFieldGroup
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.onChange}
                />
                <TextFieldGroup
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
                <TextFieldGroup
                  type="text"
                  placeholder="Mobile"
                  name="mobile"
                  value={this.state.mobile}
                  onChange={this.onChange}
                />
                <TextFieldGroup
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
                <TextFieldGroup
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={this.state.confirmPassword}
                  onChange={this.onChange}
                />
                <button
                  type="submit"
                  className="btn btn-block btn-color mt-3 mb-2"
                >
                  Register Account
                </button>
              </form>
              <p className="mb-5">
                Already a User ? <Link to="/">Sign in to Chat App</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { registerUser })(Register);
