import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

import { updateUser, getUser } from "../User";
import Cookies from "js-cookie";

import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    margin: 5,
    paddingBottom: 5,
  },
  appbar: {
    display: "flex",
    flexDirection: "row",
  },
  search: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#439dce",
    borderRadius: 10,
    padding: 5,
  },
}));

export default function Admin() {
  const classes = useStyles();

  const [users, setUsers] = useState([]);

  let user = getUser();

  const keyPress = async (event) => {
    if (event.keyCode == 13) {
      try {
        const res = await axios.get(
          "/api/admin/users/" + event.target.value,
          config
        );

        if (res) {
          setUsers(res.data);
          console.log(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  var csrftoken = Cookies.get("csrftoken");
  let config = {
    headers: {
      "X-CSRFToken": csrftoken,
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + user.api_token,
    },
  };

  const getAllUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users", config);

      if (res) {
        setUsers(res.data);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              User List
            </Typography>
            <div className={classes.search}>
              <SearchIcon />
              <TextField
                id="outlined-basic"
                variant="standard"
                InputProps={{ disableUnderline: true }}
                onKeyDown={keyPress}
              ></TextField>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
