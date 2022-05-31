import React, { useState } from "react";
import { Dropdown, DropdownButton, Form } from "react-bootstrap";
import "../styles/Login.css";

function Login() {
  const [showSignup, setshowSignup] = useState(false);
  const [validated, setValidated] = useState(false);
  const [userType, setUserType] = useState("CUSTOMER");

  const toggleSignup = () => {
    setshowSignup(!showSignup);
  };

  const handleSelect = (e) => {
    setUserType(e);
  };

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
  };

  return (
    <div className="bg-primary d-flex justify-content-center align-items-center vh-100 ">
      <div className="card m-5 p-5">
        <div className="row">
          <div className="col">
            {!showSignup ? (
              <div className="login text-center">
                <h3>Login</h3>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group md="4" controlId="validationCustom01">
                    <div className="input-group m-1 need">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="User ID"
                        required
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
                      />
                    </div>
                  </Form.Group>

                  <input
                    type="submit"
                    className="form-control btn btn-primary"
                    value="Login"
                  />

                  <div
                    className="text-info text-center"
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
                <Form>
                  <Form.Group md="4" controlId="validationCustom02">
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="User ID"
                        required
                      />
                    </div>
                  </Form.Group>
                  <Form.Group md="4" controlId="validationCustom02">
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Select Username"
                        required
                      />
                    </div>
                  </Form.Group>
                  <Form.Group md="4" controlId="validationCustom02">
                    <div className="input-group m-1">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Email"
                        required
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
                    className="text-info text-center"
                    onClick={toggleSignup}
                    style={{ cursor: "pointer" }}
                  >
                    have an account?, Login here
                  </div>
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
