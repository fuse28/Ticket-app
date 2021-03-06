import React from "react";
import { useNavigate } from "react-router-dom";
import not from "../assets/403.svg";

function Unauthorised() {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <section className="bg-light vh-100 d-flex justify-content-center align-items-center text-center">
      <div>
        <h1>Unauthorized Assess</h1>
        <img src={not} alt="/" />
        <br />
        <p className="text-danger">you don't have access to this page</p>
        <div className="flex-row">
          <button className="btn btn-primary" onClick={goBack}>
            go back
          </button>
        </div>
      </div>
    </section>
  );
}

export default Unauthorised;
