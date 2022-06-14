import React from "react";
import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Sidebar from "../component/Sidebar";
import { Modal, ModalTitle } from "react-bootstrap";
import MaterialTable from "@material-table/core";
import "../styles/admin.css";
import { fetchTicket } from "../api/ticket";

function Admin() {
  const [userModal, setUserModal] = useState(false);

  const showUserModal = () => {
    setUserModal(true);
  };
  const closeUserModal = () => {
    setUserModal(false);
  };

  useEffect(() => {
    (async () => {
      fetchTickets();
    })();
  }, []);

  const fetchTickets = () => {
    fetchTicket()
      .then(function (response) {
        if (response.status === 200) {
          console.log(response);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="bg-light vh-100">
      <div className="row">
        <div className="col-1">
          <Sidebar />
        </div>
        <div className="container col m-1">
          <h3 className="text-primary text-center">Welcome Admin</h3>
          <p className="text-muted text-center">
            Take a quick look at your stats below
          </p>
          {/* !cards starts from here */}
          <div className="row my-5 mx-2 text-center">
            <div className="col my-1 p-2 ">
              <div
                className="card bg-primary bg-opacity-25 "
                style={{ width: 12 + "rem" }}
              >
                <div className="cardbody borders-b">
                  <h5 className="card-subtitle">
                    <i className="bi bi-pen text-primary mx-2"></i>
                    OPEN
                  </h5>
                  <hr />
                  <div className="row">
                    <div className="col">8</div>
                    <div className="col">
                      <div style={{ height: 30, width: 30 }}>
                        <CircularProgressbar
                          value={60}
                          styles={buildStyles({
                            textColor: "blue",
                            pathColor: "darkBlue",
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <MaterialTable
            columns={[
              {
                title: "User Id",
                field: "userId",
              },
              {
                title: "Name",
                field: "name",
              },
              {
                title: "Status",
                field: "status",
                lookup: {
                  APPROVED: "APPROVED",
                  PENDING: "PENDING",
                  REJECT: "REJECT",
                },
              },
            ]}
            data={[
              {
                name: "Aatish",
                status: "PENDING",
              },
            ]}
            title="User Records"
          />
          <button className="btn btn-primary" onClick={showUserModal}>
            Edit
          </button>
          <Modal
            show={userModal}
            onHide={closeUserModal}
            backdrop="static"
            centered
          >
            <Modal.Header closeButton>
              <ModalTitle>Edit Details</ModalTitle>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="p-1">
                  <h5 className="text-primary">User ID :</h5>
                  <div className="input-group">
                    <label className="input-group-text">
                      Name
                      <input type="text" className="form-control" />
                    </label>
                  </div>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Admin;