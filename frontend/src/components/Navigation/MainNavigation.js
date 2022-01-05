import { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/auth-context";

import "./MainNavigation.css";

const MainNavigation = () => {
  const authContext = useContext(AuthContext);
  let storageToken = localStorage.getItem('token')

  return (
    <header className="main__navigation">
      <div className="main__navigation-logo">
        <h1>ToDoApp</h1>
      </div>
      <nav className="main__navigation-items">
        <ul>
          {(!storageToken) && (
            <li>
              <NavLink to="/signin">Sign In</NavLink>
            </li>
          )}
          {(!storageToken) && (
            <li>
              <NavLink end to="/signup">
                Sign Up
              </NavLink>
            </li>
          )}
          {(storageToken) && (
            <li>
              <button onClick={authContext.logout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
