import React from "react";
import { useState } from "react";
import Sidebar from "../component/Sidebar";
import MaterialTable from "@material-table/core";
import { ExportPdf, ExportCsv } from "@material-table/exporters";
import { Modal } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
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

  const pieData = [
    { name: "OPEN", value: ticketCount.open },
    { name: "PENDING", value: ticketCount.pending },
    { name: "CLOSED", value: ticketCount.closed },
    { name: "BLOCKED", value: ticketCount.blocked },
    { name: "PENDING", value: ticketCount.pending },
  ];

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
      } else {
        data.pending += 1;
      }
    });
    setticketCount(Object.assign({}, data));
  };
  console.log(ticketCount);
  const onOpenTicketModal = () => {
    setTicketModal(true);
  };
  const onCloseTicketModal = () => {
    setTicketModal(false);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
            {/* {ticketUpdateModal ? ( */}
            {/* <Modal
                // show={ticketUpdateModal}
                onHide={onCloseTicketModal}
                backdrop="static"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Update Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {/* <form onSubmit={updateTicket}> */}
            {/* <div className="p-1">
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
              </Modal> */}
            {/* ) : (
              ""
            )} */}

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
              // data={userDetails}
              title="Ticket Assigned"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Engineer;
