// components/Navbar.js
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/Navbar.css';
import Spinner from 'react-bootstrap/Spinner';

const Navbar = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
  
    return (
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="navbar-brand ms-3">
          <img src="/Images/pixel-alien-ico.png" alt="App Icon" className="icon" />
        </div>

        <div className="navbar-title-container">
          {isAuthenticated ? (
            <img src="/Images/pixel-life.png" alt="Title" className="title-img" />
          ) : null}
        </div>

        <div className="collapse navbar-collapse justify-content-end me-3">
          {isLoading ? (
            <Spinner
              animation="border"
              role="status"
              style={{ color: 'yellow' }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : isAuthenticated ? (
            <div className="navbar-nav align-items-center">
              <img src={user.picture} alt={user.name} className="user-image rounded-circle" style={{ width: "40px", height: "40px", marginRight: "10px" }} />
              <span className="nav-item nav-link text-light">{user.name}</span>
              <LogoutButton className="btn btn-outline-danger" />
            </div>
          ) : (
            <LoginButton className="btn btn-outline-primary" />
          )}
        </div>
      </nav>
    );
};

export default Navbar;
