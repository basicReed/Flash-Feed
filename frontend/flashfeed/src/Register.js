import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlashFeedApi from "./Api";
import "./LoginRegister.css";

function Register({ storeUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/jobly");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let token = await FlashFeedApi.register(
        username,
        password,
        firstName,
        lastName,
        email,
        imageUrl
      );
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
            <h1>Sign Up</h1>
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
              <div className="form-group">
                <label>
                  First Name:
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Last Name:
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Email:
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
              </div>
              <div className="form-group">
                <label>
                  Profile Picture:
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Image Url (optional)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </label>
              </div>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
              <a
                className="login-register-link"
                onClick={() => navigate("/login")}
              >
                Login
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
