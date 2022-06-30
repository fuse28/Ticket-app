import React, { useState } from "react";
import { Dropdown, DropdownButton, Form } from "react-bootstrap";
import "../styles/login.css";
import { userSignin, userSignup } from "../api/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showSignup, setshowSignup] = useState(false);
  const [validated, setValidated] = useState(false);
  const [userType, setUserType] = useState("CUSTOMER");
  const [userSignupData, setUserSignupData] = useState({});
  const [message, setMessage] = useState("");

  const toggleSignup = () => {
    setshowSignup(!showSignup);
  };

  const handleSelect = (e) => {
    setUserType(e);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  const updateSignupData = (e) => {
    userSignupData[e.target.id] = e.target.value;
    console.log(userSignupData);
  };

  const signupFn = (e) => {
    const username = userSignupData.username;
    const userId = userSignupData.userId;
    const email = userSignupData.email;
    const password = userSignupData.password;

    const data = {
      name: username,
      userId: userId,
      email: email,
      userTypes: userType,
      password: password,
    };
    console.log("DATA", data);

    e.preventDefault();

    userSignup(data)
      .then(function (response) {
        console.log(response);
        if (response.status === 201) {
          history(0);
        }
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          setMessage(error.response.data.message);
        } else {
          console.log(error);
        }
      });
  };

  const history = useNavigate();

  const loginfn = (e) => {
    const userId = userSignupData.userId;
    const password = userSignupData.password;

    const data = {
      userId: userId,
      password: password,
    };
    console.log("DATA", data);
    e.preventDefault();

    userSignin(data)
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          localStorage.setItem("name", response.data.name);
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("userTypes", response.data.userTypes);
          localStorage.setItem("userStatus", response.data.userStatus);
          localStorage.setItem("token", response.data.accessToken);

          if (response.data.userTypes === "CUSTOMER") {
            history("/customer");
          } else if (response.data.userTypes === "ENGINEER") {
            history("/engineer");
          } else {
            history("/admin");
          }
        }
      })
      .catch(function (error) {
        if (error.response.status === 400) {
          setMessage(error.response.data.message);
        } else {
          console.log(error);
        }
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <div className="card-1  m-5 p-5">
        <div className="row">
          <div className="col">
            {!showSignup ? (
              <div className="login text-center">
                <h3>Login</h3>
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit && loginfn}
                >
                  <Form.Group md="4" controlId="validationCustom01">
                    <div className="input-group m-1 need">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="User ID"
                        required
                        id="userId"
                        onChange={updateSignupData}
                      />
                    </div>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group md="4" controlId="validationCustom02">
                    <div className="input-group m-1">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="password"
                        required
                        id="password"
                        onChange={updateSignupData}
                      />
                    </div>
                  </Form.Group>

                  <input
                    type="submit"
                    className="form-control btn btn-primary"
                    value="Login"
                  />

                  <div
                    className="text-primary text-center"
                    onClick={toggleSignup}
                    style={{ cursor: "pointer" }}
                  >
                    Don't have an account?, Signup here
                  </div>
                </Form>
              </div>
            ) : (
              <div className=" signup text-center">
                <h3>Sign up</h3>
                <Form onSubmit={signupFn}>
                  <Form.Group md="4" controlId="validationCustom02">
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="User ID"
                        id="userId"
                        required
                        onChange={updateSignupData}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group md="4" controlId="validationCustom02">
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Select Username"
                        id="username"
                        required
                        onChange={updateSignupData}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group md="4" controlId="validationCustom02">
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                        id="email"
                        required
                        onChange={updateSignupData}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group md="4" controlId="validationCustom02">
                    <div className="input-group m-1">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Select password"
                        required
                        id="password"
                        onChange={updateSignupData}
                      />
                    </div>
                  </Form.Group>
                  <div className="input-group m-1">
                    <span className="text-muted">user type</span>
                    <DropdownButton
                      align="end"
                      title={userType}
                      variant="light"
                      className="mx-1"
                      onSelect={handleSelect}
                    >
                      <Dropdown.Item eventKey="CUSTOMER">
                        CUSTOMER
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="ENGINEER">
                        ENGINEER
                      </Dropdown.Item>
                    </DropdownButton>
                  </div>
                  <div className="input-group m-1">
                    <input
                      type="submit"
                      className="form-control btn btn-primary"
                      value="Sign in"
                    />
                  </div>
                  <div
                    className="text-primary text-center"
                    onClick={toggleSignup}
                    style={{ cursor: "pointer" }}
                  >
                    have an account?, Login here
                  </div>
                  <div className="text">{message}</div>
                </Form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
