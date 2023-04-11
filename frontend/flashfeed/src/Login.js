import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlashFeedApi from "./Api";
import "./LoginRegister.css";

function Login({ storeUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let token = await FlashFeedApi.login(username, password);
      storeUser(token, username);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <div className="profile-form">
        <div className="card card-form">
          <div className="card-body">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  Username:
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    autoComplete="current-username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Password:
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </div>
              <button type="submit" className="btn btn-primary">
                Log In
              </button>
              <a
                className="login-register-link"
                onClick={() => navigate("/register")}
              >
                Register
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
