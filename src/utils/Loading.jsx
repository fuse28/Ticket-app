import * as React from "react";
import { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

//1) get all the necessary keys in place: .env, url
//2)fetch the api in console
//3) Map through the array of object and print it in list
//4) to work on UI
