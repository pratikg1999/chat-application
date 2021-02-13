import "./Navbar.css";

function Navbar(props) {
  const { user, logout } = props;
  return (
    <nav className="navbar-color">
      <div className="row m-0">
        <div className="col-3 text-left">
          <button className="btn text-white" onClick={logout.bind(this)}>
            <i className="fas fa-sign-out-alt logout-icon"></i> Logout
          </button>
        </div>
        <div className="col-6 text-center">
          <span className="h2">Chat App</span>
        </div>
        <div className="col-3 text-right">
          <img className="nav-avatar rounded" src={user.avatar} alt="Avatar" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
