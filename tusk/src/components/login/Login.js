import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Axios from "axios";
import JWT from "jsonwebtoken";
import { useState } from "react";
import Alert from "@mui/material/Alert";

import "./Login.css";

export default function Login(props) {
  const initialRegValue = {
    email: "",
    passwd: "",
    repasswd: ""
  };

  const [regValue, setRegValue] = useState(initialRegValue);

  function inputValChangeHandler(e) {
    const { name, value } = e.target;
    setRegValue({
      ...regValue,
      [name]: value
    });
  }

  const [loginErr, setLoginErr] = useState();
  const [regErr, setRegErr] = useState([]);
  const [regSuccess, setRegSuccess] = useState();

  function registerHandler() {
    Axios.post("http://localhost:5000/register", regValue)
      .then(res => {
        if (res.status == 201) {
          setRegValue(initialRegValue);
          setRegErr(res.data);
          setTimeout(function () {
            setRegErr([]);
          }, 3000);
        } else if (res.status == 200) {
          setRegValue(initialRegValue);
          setRegSuccess(res.data);
          setTimeout(function () {
            setRegSuccess(undefined);
          }, 3000);
        }
      })
      .catch(err => console.log(err));
  }

  function loginHandler() {
    Axios.post("http://localhost:5000/login", regValue)
      .then(res => {
        localStorage.removeItem("author");
        try {
          let userDetails = JWT.verify(res.data, "jwtse3423cretfsfhhss443");
          localStorage.setItem("author", userDetails.email);
          props.setRegStat(false);
          props.setLoginStat(true);
        } catch {
          setRegValue(initialRegValue);
          //console.log("Invalid User");
          setLoginErr("Invalid User");
          setTimeout(function () {
            setLoginErr(undefined);
          }, 3000);
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="loginBlock">
      <div className="logo">
        <img src="/tusk_logo.png" alt="logo" />
      </div>
      <Card sx={{ minWidth: 275 }} className="loginBox">
        <CardContent>
          <Typography variant="h5" gutterBottom component="div" color="text.primary">
            {props.regStat ? "Login" : "Register"}
          </Typography>
          <TextField required fullWidth name="email" label="Email" value={regValue.email} placeholder="Enter a valid Email" sx={{ mb: 3, mt: 2 }} onChange={inputValChangeHandler} />
          <TextField required fullWidth name="passwd" label="Password" value={regValue.passwd} placeholder={props.regStat ? "Enter your password" : "Enter a new password"} type="password" sx={{ mb: 3 }} onChange={inputValChangeHandler} />
          {props.regStat ? "" : <TextField required fullWidth name="repasswd" value={regValue.repasswd} label="Repeat Password" placeholder="Re-enter password" type="password" onChange={inputValChangeHandler} />}
        </CardContent>
        <CardActions>
          {props.regStat ? (
            <Button size="medium" variant="contained" onClick={loginHandler}>
              Login
            </Button>
          ) : (
            <Button size="medium" variant="contained" onClick={registerHandler}>
              Register
            </Button>
          )}

          <Button size="medium" color="secondary" onClick={props.toggleLoginHandler}>
            {props.regStat ? "Create a new account" : "Already have an account ?"}
          </Button>
        </CardActions>
      </Card>
      {loginErr ? (
        <Alert severity="error" sx={{ bgcolor: "#cb0606", color: "#fff", marginTop: "1rem" }}>
          {loginErr}
        </Alert>
      ) : (
        ""
      )}
      {regSuccess ? (
        <Alert severity="success" sx={{ bgcolor: "#244225", color: "#fff", marginTop: "1rem" }}>
          {regSuccess}
        </Alert>
      ) : (
        ""
      )}
      {regErr.length > 0
        ? regErr.map((item, key) => (
            <Alert key={key} severity="error" sx={{ bgcolor: "#cb0606", color: "#fff", marginTop: "1rem" }}>
              {item}
            </Alert>
          ))
        : ""}
    </div>
  );
}
