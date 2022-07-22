import React from "react";
import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Sidebar from "../component/Sidebar";
import { Modal, Button } from "react-bootstrap";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import "../styles/admin.css";
import { fetchTicket, ticketUpdation } from "../api/ticket.js";
import { getAllUser, updateUserData } from "../api/user.js";
import Loading from "../utils/Loading";

const logoutFn = () => {
  localStorage.clear();
  window.location.href = "/";
};

function Admin() {
  const [userList, setUserList] = useState([]);
  const [userModal, setUserModal] = useState(false);
  const [ticketDetails, setTicketDetails] = useState([]); //old values
  const [userDetail, setUserDetail] = useState({});
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({}); //updated values
  const [ticketUpdateModal, setTicketUpdateModal] = useState(false);
  const [ticketCount, setTicketCount] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // {new Obj } new values user
  // First update with selectedCurr Ticket ==> grab the specific row  ==> CURR VALUE
  // Second update : replacing old values with new data ==> NEW VALUES THAT UOU ENTERED IN MODAL

  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);

  const showUserModal = () => {
    setUserModal(true);
  };
  const closeUserModal = () => {
    setUserModal(false);
    setUserDetail({});
  };
  const closeTicketUpdationModal = () => setTicketUpdateModal(false);

  useEffect(() => {
    (async () => {
      fetchTickets();
      fetchUsers("");
    })();
  }, []);

  const fetchTickets = () => {
    setLoading(true);
    fetchTicket()
      .then(function (response) {
        if (response.status === 200) {
          console.log(response);
          setTicketDetails(response.data);
          updateTicketCount(response.data);
          setLoading(false);
        }
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          logoutFn();
        }
        console.log(error);
      });
  };

  const fetchUsers = (userId) => {
    setLoading(true);
    getAllUser(userId)
      .then(function (response) {
        if (response.status === 200) {
          if (userId) {
            setUserDetail(response.data[0]);
            showUserModal();
          } else {
            setLoading(false);
            setUserList(response.data);
          }
        }
      })
      .catch(function (error) {
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
        setMessage("Ticket updated successfully");
        closeTicketUpdationModal();
        fetchTickets();
      })
      .catch(function (error) {
        if (error.response.status === 400) setMessage(error.message);
        else if (error.response.status === 401) logoutFn();
        else console.log(error);
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

  const updateUserDetail = () => {
    const data = {
      userType: userDetail.userTypes,
      userStatus: userDetail.useStatus,
      userName: userDetail.name,
    };
    updateUserData(userDetail.userId, data)
      .then(function (response) {
        if (response.status === 200) {
          setMessage(response.message);
          let idx = userList.findIndex(
            (obj) => obj.userId === userDetail.userId
          );
          userList[idx] = userDetail;
          closeUserModal();
          setMessage("User details updated successfully");
        }
      })
      .catch(function (error) {
        if (error.status === 400) setMessage(error.message);
        else if ((error.response.status = 401)) {
          logoutFn();
        } else {
          console.log(error);
        }
      });
  };

  const changeUserDetail = (e) => {
    if (e.target.name === "status") userDetail.userStatus = e.target.value;
    else if (e.target.name === "name") userDetail.name = e.target.value;
    else if (e.target.name === "type") userDetail.userTypes = e.target.value;
    setUserDetail(userDetail);
    setUserModal(e.target.value);
  };

  return (
    <div className="bg-light min-vh-100 ">
      <div className="row">
        <div className="col-1">
          <Sidebar home="/" />
        </div>

        {loading ? (
          <Loading />
        ) : (
          <div className="container col m-1">
            <h3 className="text-primary text-center">
              Welcome ,{localStorage.getItem("name")}
            </h3>
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

            <h3 className="text-success">
              {message.includes("User") ? message : ""}
            </h3>

            <div className="container">
              <MaterialTable
                onRowClick={(event, rowData) => fetchUsers(rowData.userId)}
                data={userList}
                columns={[
                  {
                    title: "USER ID",
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
                    title: "EMAIL",
                    field: "email",
                    filtering: false,
                  },
                  {
                    title: "ROLE",
                    field: "userTypes",
                    lookup: {
                      ADMIN: "ADMIN",
                      CUSTOMER: "CUSTOMER",
                      ENGINEER: "ENGINEER",
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
                // actions={[
                //   {
                //     icon:Delete,
                //     tooptip: "Delete entry",
                //     onClick: (event, rowData) => deleteEntry(rowdata)
                //   }
                // ]}

                options={{
                  filtering: true,
                  sorting: true,
                  exportMenu: [
                    {
                      label: "Export PDF",
                      exportFunc: (cols, datas) =>
                        ExportPdf(cols, datas, "UserRecords"),
                    },
                    {
                      label: "Export CSV",
                      exportFunc: (cols, datas) =>
                        ExportCsv(cols, datas, "userRecords"),
                    },
                  ],
                  headerStyle: {
                    backgroundColor: "darkblue",
                    color: "#FFF",
                  },
                  rowStyle: {
                    backgroundColor: "#EEE",
                  },
                }}
                title="USER RECORDS"
              />
              {/* </MuiThemeProvider>  */}
              <br />
              <div className="text-success">
                {message.includes("Ticke") ? message : ""}
              </div>

              <MaterialTable
                onRowClick={(event, rowData) => editTicket(rowData)}
                data={ticketDetails}
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
                    title: "DESCRIPTIONS",
                    field: "description",
                    filtering: false,
                  },
                  {
                    title: "REPORTER",
                    field: "reporter",
                  },
                  {
                    title: "PRIORITY",
                    field: "ticketPriority",
                  },
                  {
                    title: "ASSIGNEE",
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
                  filtering: true,
                  sorting: true,
                  exportMenu: [
                    {
                      label: "Export PDF",
                      exportFunc: (cols, datas) =>
                        ExportPdf(cols, datas, "TicketRecords"),
                    },
                    {
                      label: "Export CSV",
                      exportFunc: (cols, datas) =>
                        ExportCsv(cols, datas, "TicketRecords"),
                    },
                  ],
                  headerStyle: {
                    backgroundColor: "darkblue",
                    color: "#FFF",
                  },
                  rowStyle: {
                    backgroundColor: "#EEE",
                  },
                }}
                title="TICKETS RECORD"
              />

              {userModal ? (
                <Modal
                  show={userModal}
                  onHide={closeUserModal}
                  backdrop="static"
                  keyboard={false}
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form onSubmit={updateUserDetail}>
                      <div className="p-1">
                        <h5 className="card-subtitle mb-2 text-primary lead">
                          User ID: {userDetail.userId}
                        </h5>
                        <hr />
                        <div className="input-group mb-3">
                          <label className="label input-group-text label-md ">
                            Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={userDetail.name}
                            onChange={changeUserDetail}
                          />
                        </div>
                        <div className="input-group mb-3">
                          <label className="label input-group-text label-md ">
                            Email
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={userDetail.email}
                            onChange={changeUserDetail}
                            disabled
                          />
                        </div>

                        <div className="input-group mb-3">
                          <label className="label input-group-text label-md ">
                            Type
                          </label>
                          <select
                            className="form-select"
                            name="type"
                            value={userDetail.userTypes}
                            onChange={changeUserDetail}
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="ENGINEER">ENGINEER</option>
                          </select>
                        </div>

                        <div className="input-group mb-3">
                          <label className="label input-group-text label-md ">
                            Status
                          </label>
                          <select
                            name="status"
                            className="form-select"
                            value={userDetail.userStatus}
                            onChange={changeUserDetail}
                          >
                            <option value="APPROVED">APPROVED</option>
                            <option value="REJECTED">REJECTED</option>
                            <option value="PENDING">PENDING</option>
                          </select>
                        </div>
                      </div>
                      <div className="input-group justify-content-center">
                        <div className="m-1">
                          <Button
                            variant="secondary"
                            onClick={() => closeUserModal()}
                          >
                            Close
                          </Button>
                        </div>
                        <div className="m-1">
                          <Button
                            variant="primary"
                            onClick={() => updateUserDetail()}
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    </form>
                  </Modal.Body>
                  <Modal.Footer></Modal.Footer>
                </Modal>
              ) : (
                ""
              )}

              {ticketUpdateModal ? (
                <Modal
                  show={ticketUpdateModal}
                  onHide={closeTicketUpdationModal}
                  backdrop="static"
                  keyboard={false}
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>UPDATE TICKET</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form onSubmit={updateTicket}>
                      <div className="p-1">
                        <h5 className="card-subtitle mb-2 text-primary lead">
                          Ticket ID: {selectedCurrTicket.id}
                        </h5>
                        <hr />

                        <div className="input-group mb-3">
                          <label className="label input-group-text label-md ">
                            Title
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={selectedCurrTicket.title}
                            onChange={onTicketUpdate}
                            required
                          />
                        </div>

                        <div className="input-group mb-3">
                          <label className="label input-group-text label-md ">
                            PRIORITY
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="ticketPriority"
                            value={selectedCurrTicket.ticketPriority}
                            onChange={onTicketUpdate}
                            min="1"
                            max="5"
                            required
                          />
                          <p className="text-danger">*</p>
                        </div>

                        <div className="input-group mb-3">
                          <label className="label input-group-text label-md ">
                            Assignee
                          </label>
                          <select
                            className="form-select"
                            name="assignee"
                            value={selectedCurrTicket.assignee}
                            onChange={onTicketUpdate}
                          >
                            {/* we want the full user list printed ere so that we can assign the new user 
                            - The user List is coming from the getUsers api ===> userDetails
                            - We only want to print engineers 
                        */}
                            {userList.map((e, key) => {
                              if (e.userTypes === "ENGINEER")
                                return (
                                  <option key={key} value={e.value}>
                                    {e.name}
                                  </option>
                                );
                              else return undefined;
                            })}
                          </select>
                        </div>

                        <div className="input-group mb-3">
                          <label className="label input-group-text label-md ">
                            Status
                          </label>
                          <select
                            className="form-select"
                            name="status"
                            value={selectedCurrTicket.status}
                            onChange={onTicketUpdate}
                          >
                            <option value="OPEN">OPEN</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="BLOCKED">BLOCKED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </div>
                        <div className="md-form amber-textarea active-amber-textarea-2">
                          <textarea
                            id="form16"
                            className="md-textarea form-control"
                            rows="3"
                            name="description"
                            placeholder="Description"
                            value={selectedCurrTicket.description}
                            onChange={onTicketUpdate}
                            required
                          ></textarea>
                        </div>
                      </div>

                      <div className="input-group justify-content-center">
                        <div className="m-1">
                          <Button
                            variant="secondary"
                            onClick={() => closeTicketUpdationModal()}
                          >
                            Cancel
                          </Button>
                        </div>
                        <div className="m-1">
                          <Button type="submit" variant="primary">
                            Update
                          </Button>
                        </div>
                      </div>
                    </form>
                    <p className="text-danger">
                      * This field accept only number
                    </p>
                  </Modal.Body>
                  <Modal.Footer></Modal.Footer>
                </Modal>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
