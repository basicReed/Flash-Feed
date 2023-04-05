import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import FlashFeedApi from "./Api";

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
    <div className="profile-form">
      <h1>Sign Up</h1>
      <div className=" card card-form">
        <div className="card-body">
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                Username:
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  autocomplete="current-username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Label>
            </FormGroup>
            <FormGroup>
              <Label>
                Password:
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  autocomplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Label>
            </FormGroup>
            <FormGroup>
              <Label>
                First Name:
                <Input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Label>
            </FormGroup>
            <FormGroup>
              <Label>
                Last Name:
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Label>
            </FormGroup>
            <FormGroup>
              <Label>
                Email:
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Label>
            </FormGroup>
            <FormGroup>
              <Label>
                Profile Picture:
                <Input
                  type="imageUrl"
                  placeholder="Image Url (optional)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </Label>
            </FormGroup>
            <Button type="submit">Register</Button>
            <a
              className="login-register-link"
              onClick={() => navigate("/login")}
            >
              {" "}
              Login
            </a>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
