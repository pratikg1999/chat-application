import React, { Component } from "react";
import logo from "../assets/images/logo.jpg";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
import TextFieldGroup from "../components/Common/FormElements/TextFieldGroup";
import { Link } from "react-router-dom";
class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
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
    const user = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(user);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    localStorage.clear();
    console.log(process.env.REACT_APP_ENV);
  }

  componentDidUpdate() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <div className="login">
        <div className="container">
          <div className="row justify-content-center align-content-center occupy-window">
            <div className="col-md-6 m-auto">
              <div className="mb-5">
                <img className="logo-size rounded" src={logo} alt="Logo" />
                <span className="h2 text-center">Chat App</span>
              </div>
              <h1 className="text-center mb-5">Sign in to Chat App</h1>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  type="email"
                  placeholder="name@work-email.com"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
                <TextFieldGroup
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
                <button
                  type="submit"
                  className="btn btn-block btn-color mt-3 mb-2"
                >
                  Sign In With Email
                </button>
              </form>
              <p className="mb-5">
                New to Chat App ? <Link to="/register">Create an Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { loginUser })(Login);
