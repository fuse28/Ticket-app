//! url: crm/api/v1/tickets => api we're fetching
//? Authorization: x-access-token : token, userId: userid
//* post api: allow the user to create a ticket
//* put api:  allow the engg, user to edit the ticket

import axios from "axios";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

export async function fetchTicket() {
  return await axios.get(
    `${BASE_URL}/crm/api/v1/tickets/`,
    {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    },
    {
      userId: localStorage.getItem("userId"),
    }
  );
}
export async function ticketUpdation(id, selectedCurrentTicket) {
  return await axios.put(
    `${BASE_URL}/crm/api/v1/tickets/${id}`,
    selectedCurrentTicket,
    {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    },
    {
      userId: localStorage.getItem("userId"),
    }
  );
}
