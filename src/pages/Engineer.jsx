import React from "react";
import { useState } from "react";
import Sidebar from "../component/Sidebar";
import MaterialTable from "@material-table/core";
import { ExportPdf, ExportCsv } from "@material-table/exporters";
import { Modal } from "react-bootstrap";
import Button from "@mui/material/Button";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { fetchTicket, ticketUpdation } from "../api/ticket";
import { useEffect } from "react";

const logoutFn = () => {
  localStorage.clear();
  window.location.href = "/";
};

function Engineer() {
  const [ticketModal, setTicketModal] = useState(false);
  const [ticketDetails, setTicketDetails] = useState([]);
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});
  const [ticketCount, setticketCount] = useState({});
  const [message, setMessage] = useState("");
  const [task, setTask] = useState("");

  const pieData = [
    { name: "OPEN", value: ticketCount.open },
    { name: "PENDING", value: ticketCount.pending },
    { name: "CLOSED", value: ticketCount.closed },
    { name: "BLOCKED", value: ticketCount.blocked },
  ];

  const onOpenTicketModal = () => {
    setTicketModal(true);
  };
  const onCloseTicketModal = () => {
    setTicketModal(false);
  };

  const updateSelectedCurrTicket = (data) => {
    setSelectedCurrTicket(data);
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
          setTicketDetails(response.data);
          updateTicketsCount(response.data);
        }
      })
      .catch(function (error) {
        if (error.response.status === 401) {
          logoutFn();
        }
        console.log(error);
      });
  };
  const editTicket = (ticketDetail) => {
    const ticket = {
      assignee: ticketDetail.assignee,
      description: ticketDetail.description,
      id: ticketDetail.id,
      reporter: ticketDetail.reporter,
      status: ticketDetail.status,
      ticketPriority: ticketDetail.ticketPriority,
      title: ticketDetail.title,
    };
    setSelectedCurrTicket(ticket);
    setTicketModal(true);
  };
  const onTicketUpdate = (e) => {
    // id of ticket, assignee, reporter
    if (e.target.name === "title") selectedCurrTicket.title = e.target.value;
    else if (e.target.name === "description")
      selectedCurrTicket.description = e.target.value;
    else if (e.target.name === "status")
      selectedCurrTicket.status = e.target.value;
    else if (e.target.name === "ticketPriority")
      selectedCurrTicket.ticketPriority = e.target.value;

    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket));
  };

  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket)
      .then(function (response) {
        setMessage("Ticket Updated Successfully");
        onCloseTicketModal();
        fetchTickets();
      })
      .catch(function (error) {
        if (error.status === 400) setMessage(error.message);
        else if (error.response.status === 401) {
          logoutFn();
          setMessage("Authorization error,retry loging in");
        }
        onCloseTicketModal();
        console.log(error.message);
      });
  };
  const updateTicketsCount = (tickets) => {
    const data = {
      open: 0,
      closed: 0,
      pending: 0,
      blocked: 0,
    };
    tickets.forEach((x) => {
      if (x.status === "OPEN") {
        data.open += 1;
      } else if (x.status === "IN_PROGRESS") {
        data.progress += 1;
      } else if (x.status === "BLOCKED") {
        data.blocked += 1;
      } else if (x.status === "CLOSED") {
        data.closed += 1;
      }
    });
    setticketCount(Object.assign({}, data));
  };
  console.log(ticketCount);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const tasks = [
    {
      value: "OPEN",
      label: "OPEN",
    },
    {
      value: "IN_PROGRESS",
      label: "IN_PROGRESS",
    },
    {
      value: "BLOCKED",
      label: "BLOCKED",
    },
    {
      value: "CLOSED",
      label: "CLOSED",
    },
  ];
  const handleChange = (event) => {
    setTask(event.target.value);
  };

  return (
    <div className="bg-light min-vh-100 ">
      <div className="row">
        <div className="col-1">
          <Sidebar />
        </div>
        <div className="container col m-1">
          <h3 className="text-primary text-center">
            Welcome {localStorage.getItem("name")}
          </h3>
          <p className="text-muted text-center">
            Take a quick look at your stats below
          </p>
          <div className="d-flex justify-content-center align-items-center">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={pieData}
                fill="#8884d8"
              />
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

              <Tooltip />
            </PieChart>
          </div>
          <hr />

          <div className="container">
            {/* USER RECORD TABLE */}

            <MaterialTable
              data={ticketDetails}
              onRowClick={(event, rowData) => editTicket(rowData)}
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
              title="Ticket Assigned"
            />
            <button className="btn btn-info " onClick={onOpenTicketModal}>
              Open modal
            </button>

            {ticketModal ? (
              <Modal
                show={ticketModal}
                onHide={onCloseTicketModal}
                backdrop="static"
                keyboard={false}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>UPDATE TICKET</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <div>
                      <h5 className="card-subtitle mb-2 text-primary lead">
                        Ticket ID: {selectedCurrTicket.id}
                      </h5>
                      <TextField
                        id="stadard-basic"
                        label="Title*"
                        variant="standard"
                        color="error"
                        value={selectedCurrTicket.title}
                        onChange={onTicketUpdate}
                      />
                      <TextField
                        disabled
                        id="stadard-basic"
                        label="Assignee"
                        variant="standard"
                        value={selectedCurrTicket.assignee}
                      />
                      <TextField
                        id="filled-number"
                        label="Priority"
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="standard"
                        value={selectedCurrTicket.ticketPriority}
                        onChange={onTicketUpdate}
                      />
                      <TextField
                        id="standard-select-task"
                        select
                        label="Status"
                        value={selectedCurrTicket.status}
                        onChange={onTicketUpdate && handleChange}
                        helperText="Please select your task"
                        variant="standard"
                      >
                        {tasks.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        id="standard-multiline-static"
                        label="description"
                        multiline
                        rows={5}
                        variant="standard"
                        value={selectedCurrTicket.description}
                      />
                    </div>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => onCloseTicketModal()}
                    color="error"
                  >
                    Cancel
                  </Button>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
              </Modal>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Engineer;
