import React from "react";
import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Sidebar from "../component/Sidebar";
import { Modal, ModalTitle, Button } from "react-bootstrap";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import "../styles/admin.css";
import { fetchTicket, ticketUpdation } from "../api/ticket";
import { getAllUsers } from "../api/user";
import Loading from "../utils/Loading";

function Admin() {
  const [userModal, setUserModal] = useState(false);
  const [ticketDetails, setTicketDetails] = useState({}); //old values
  const [userDetails, setUserDetails] = useState([]);
  const [ticketList, setTicketList] = useState([]);
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({}); //updated values
  const [ticketUpdateModal, setTicketUpdateModal] = useState(false);
  const [ticketCount, setTicketCount] = useState({});
  const [loading, setLoading] = useState(false);

  // {new Obj } new values user
  // First update with selectedCurr Ticket ==> grab the specific row  ==> CURR VALUE
  // Second update : replacing old values with new data ==> NEW VALUES THAT UOU ENTERED IN MODAL

  const updateSelectedCurrTicket = (data) => {
    setSelectedCurrTicket(data);
  };

  const onCloseTicketModal = () => {
    setTicketUpdateModal(false);
  };

  const showUserModal = () => {
    setUserModal(true);
  };
  const closeUserModal = () => {
    setUserModal(false);
  };

  useEffect(() => {
    (async () => {
      fetchTickets();
      fetchUsers();
    })();
  }, []);

  const fetchTickets = () => {
    setLoading(true);
    fetchTicket()
      .then(function (response) {
        if (response.status === 200) {
          console.log(response);
          setTicketList(response.data);
          updateTicketCount(response.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchUsers = (userId) => {
    setLoading(true);
    getAllUsers(userId)
      .then(function (response) {
        if (response.status === 200) {
          if (userId) {
          }
          setUserDetails(response.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //reading existing values

  const editTicket = (ticketDetail) => {
    const ticket = {
      assignee: ticketDetail.assignee,
      description: ticketDetail.description,
      id: ticketDetail.id,
      reporter: ticketDetail.reporter,
      ticketPriority: ticketDetail.ticketPriority,
      title: ticketDetail.title,
    };

    console.log(ticket);
    //storing the existing value that we grabbed in a state

    setSelectedCurrTicket(ticket);
    //open modal
    setTicketUpdateModal(true);
  };

  console.log("details", selectedCurrTicket);

  //read the updated value from the user

  const onTicketUpdate = (e) => {
    if (e.target.name === "title") {
      selectedCurrTicket.title = e.target.value;
    } else if (e.target.name === "description") {
      selectedCurrTicket.title = e.target.value;
    } else if (e.target.name === "assignee") {
      selectedCurrTicket.title = e.target.value;
    } else if (e.target.name === "reporter") {
      selectedCurrTicket.title = e.target.value;
    } else if (e.target.name === "ticketPriority") {
      selectedCurrTicket.title = e.target.value;
    }
    //! create a new object wit new values ==> object.assign
    //! (target, source) target : new values , source : destination where you want your updated values
    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket));
  };

  //! call the api
  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket)
      .then(function (response) {
        console.log("Ticket updated successfully");
        onCloseTicketModal();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const updateTicketCount = (tickets) => {
    const data = {
      pending: 0,
      closed: 0,
      open: 0,
      blocked: 0,
    };
    tickets.forEach((x) => {
      if (x.status === "OPEN") {
        data.open += 1;
      } else if (x.status === "IN_PROGRESS") {
        data.pending += 1;
      } else if (x.status === "CLOSED") {
        data.closed += 1;
      } else if (x.status === "BLOCKED") {
        data.blocked += 1;
      }
    });
    setTicketCount(Object.assign({}, data));
  };
  console.log(ticketCount);

  return (
    <div className="bg-light min-vh-100 ">
      <div className="row">
        <div className="col-1">
          <Sidebar />
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="container col m-1">
            <h3 className="text-primary text-center">Welcome Admin</h3>
            <p className="text-muted text-center">
              Take a quick look at your stats below
            </p>

            {/*//*cards starts from here */}

            <div className="d-flex">
              <div className="row container my-5 mx-2 text-center">
                <div className="col my-1 p-2 ">
                  <div className="widget-open">
                    <div
                      className="borders-b card bg-success bg-opacity-25 "
                      style={{ width: 12 + "rem" }}
                    >
                      <div className="cardbody borders-b">
                        <h5 className="card-subtitle my-2">
                          <i className="bi bi-door-open text-success mx-2 "></i>
                          <span className="text-success">OPEN</span>
                        </h5>
                        <hr />
                        <div className="row">
                          <div
                            className="col"
                            style={{
                              fontSize: "28px",
                              color: "green",
                            }}
                          >
                            {ticketCount.open}
                          </div>
                          <div className="col">
                            <div style={{ height: 30, width: 30 }}>
                              <CircularProgressbar
                                value={ticketCount.open}
                                styles={buildStyles({
                                  textColor: "green",
                                  pathColor: "darkGreen",
                                })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* //?PENDING card */}

              <div className="row container my-5 mx-2 text-center">
                <div className="col my-1 p-2 ">
                  <div className="widget-pending">
                    <div
                      className="borders-b card bg-primary bg-opacity-25 "
                      style={{ width: 12 + "rem" }}
                    >
                      <div className="cardbody borders-b">
                        <h5 className="card-subtitle my-2">
                          <i className="bi bi-clock-history text-primary mx-2 "></i>
                          <span className="text-primary">PENDING</span>
                        </h5>
                        <hr />
                        <div className="row">
                          <div
                            className="col"
                            style={{
                              fontSize: "28px",
                              color: "blue",
                            }}
                          >
                            {ticketCount.pending}
                          </div>
                          <div className="col">
                            <div style={{ height: 30, width: 30 }}>
                              <CircularProgressbar
                                value={ticketCount.pending}
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
              </div>

              {/*//TODO CLOSED card */}

              <div className="row container my-5 mx-2 text-center">
                <div className="col my-1 p-2 ">
                  <div className="widget-closed">
                    <div
                      className="borders-b card bg-warning bg-opacity-25 "
                      style={{ width: 12 + "rem" }}
                    >
                      <div className="cardbody borders-b">
                        <h5 className="card-subtitle my-2">
                          <i className="bi bi-x-circle text-warning mx-2"></i>
                          <span className="text-warning">CLOSED</span>
                        </h5>
                        <hr />
                        <div className="row">
                          <div
                            className="col "
                            style={{
                              fontSize: "28px",
                              color: "#e3c622",
                            }}
                          >
                            {ticketCount.closed}
                          </div>
                          <div className="col">
                            <div style={{ height: 30, width: 30 }}>
                              <CircularProgressbar
                                value={ticketCount.closed}
                                styles={buildStyles({
                                  textColor: "#e3c622",
                                  pathColor: "#ad9717",
                                })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*//! BLOCKED card */}

              <div className="row container my-5 mx-2 text-center">
                <div className="col my-1 p-2 ">
                  <div className="widget-blocked">
                    <div
                      className="borders-b card bg-danger bg-opacity-25  hover-shadow "
                      style={{ width: 12 + "rem" }}
                    >
                      <div className="cardbody borders-b">
                        <h5 className="card-subtitle my-2">
                          <i className="bi bi-dash-circle text-danger mx-2"></i>
                          <span className="text-danger">BLOCKED</span>
                        </h5>
                        <hr />
                        <div className="row">
                          <div
                            className="col"
                            style={{
                              fontSize: "28px",
                              color: "red",
                            }}
                          >
                            {ticketCount.blocked}
                          </div>
                          <div className="col">
                            <div style={{ height: 30, width: 30 }}>
                              <CircularProgressbar
                                value={ticketCount.blocked}
                                styles={buildStyles({
                                  textColor: "red",
                                  pathColor: "darkRed",
                                })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />

            <div className="container">
              <MaterialTable
                onRowClick={(event, ticketDetail) => editTicket(ticketDetail)}
                data={ticketList}
                columns={[
                  {
                    title: "Ticket ID",
                    field: "id",
                    cellStyle: {
                      cursor: "not-allowed",
                    },
                  },
                  {
                    title: "TITLE",
                    field: "title",
                  },
                  {
                    title: "Description",
                    field: "description",
                  },
                  {
                    title: "Reporter",
                    field: "reporter",
                  },
                  {
                    title: "Priority",
                    field: "ticketPriority",
                  },
                  {
                    title: "Assignee",
                    field: "assignee",
                  },
                  {
                    title: "Status",
                    field: "status",
                    lookup: {
                      OPEN: "OPEN",
                      IN_PROGRESS: "IN_PROGRESS",
                      BLOCKED: "BLOCKED",
                      CLOSED: "CLOSED",
                    },
                  },
                ]}
                options={{
                  exportMenu: [
                    {
                      label: "Export PDF",
                      exportFunc: (cols, datas) =>
                        ExportPdf(cols, datas, "Ticket Records"),
                    },
                    {
                      label: "Export Csv",
                      exportFunc: (cols, datas) =>
                        ExportCsv(cols, datas, "Ticket Records"),
                    },
                  ],
                  headerStyle: {
                    backgroundColor: "#4448bd",
                    color: "white",
                  },
                  rowStyle: {
                    backgroundColor: "#d7d9db",
                  },
                }}
                title="Ticket Records"
              />

              {ticketUpdateModal ? (
                <Modal
                  show={ticketUpdateModal}
                  onHide={onCloseTicketModal}
                  backdrop="static"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Update Ticket</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form onSubmit={updateTicket}>
                      <div className="p-1">
                        <h5 className="text-primary">
                          Ticket ID :{selectedCurrTicket.id}
                        </h5>
                        <div className="input-group">
                          <label className="label input-group-text label-md">
                            Title
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={selectedCurrTicket.title}
                            onChange={onTicketUpdate}
                          />
                        </div>
                        <div className="input-group">
                          <label className="label input-group-text label-md">
                            Description
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="description"
                            value={selectedCurrTicket.description}
                            onChange={onTicketUpdate}
                          />
                        </div>
                        <div className="input-group">
                          <label className="label input-group-text label-md">
                            Assignee
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="assignee"
                            value={selectedCurrTicket.assignee}
                            onChange={onTicketUpdate}
                          />
                        </div>
                        <div className="input-group">
                          <label className="label input-group-text label-md">
                            Reporter
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="reporter"
                            value={selectedCurrTicket.reporter}
                            onChange={onTicketUpdate}
                          />
                        </div>
                        <div className="input-group">
                          <label className="label input-group-text label-md">
                            Ticket Priority
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="ticketPriority"
                            value={selectedCurrTicket.ticketPriority}
                            onChange={onTicketUpdate}
                          />
                        </div>
                        <Button type="submit" className="my-1">
                          Update
                        </Button>
                      </div>
                    </form>
                  </Modal.Body>
                </Modal>
              ) : (
                ""
              )}

              <hr />

              {/* USER RECORD TABLE */}

              <MaterialTable
                columns={[
                  {
                    title: "User ID",
                    field: "userId",
                    cellStyle: {
                      cursor: "not-allowed",
                    },
                  },

                  {
                    title: "Name",
                    field: "name",
                  },
                  {
                    title: "Email",
                    field: "email",
                  },

                  {
                    title: "USER Type",
                    field: "userTypes",
                    lookup: {
                      CUSTOMER: "CUSTOMER",
                      ENGINEER: "ENGINEER",
                      ADMIN: "ADMIN",
                      CLOSED: "CLOSED",
                    },
                  },
                  {
                    title: "Status",
                    field: "userStatus",
                    lookup: {
                      APPROVED: "APPROVED",
                      PENDING: "PENDING",
                      REJECTED: "REJECTED",
                    },
                  },
                ]}
                options={{
                  filtering: true,
                  exportMenu: [
                    {
                      label: "Export Pdf",
                      exportFunc: (cols, datas) =>
                        ExportPdf(cols, datas, "User Records"),
                    },
                    {
                      label: "Export Csv",
                      exportFunc: (cols, datas) =>
                        ExportCsv(cols, datas, "User Records"),
                    },
                  ],
                  headerStyle: {
                    backgroundColor: "darkblue",
                    color: "#fff",
                  },
                  rowStyle: {
                    backgroundColor: "#eee",
                    cursor: "pointer",
                  },
                }}
                data={userDetails}
                title="User Records"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
