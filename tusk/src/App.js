import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useState, useEffect, useContext } from "react";
import { useImmerReducer } from "use-immer";

// Custom Component Import
import Login from "./components/login/Login";
import Footer from "./components/footer/Footer";
import Tasks from "./components/tasks/Tasks";

//Context Imports
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

import "./App.css";

function App() {
  const initialState = {
    taskList: []
  };

  function appReducer(draft, action) {
    switch (action.type) {
      case "tasklist-updated":
        draft.taskList = action.data;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(appReducer, initialState);

  const [regStat, setRegStat] = useState(true);

  function toggleLoginHandler() {
    if (regStat) {
      setRegStat(false);
    } else {
      setRegStat(true);
    }
  }

  const [loginStat, setLoginStat] = useState(false);

  function logoutHandler() {
    localStorage.removeItem("author");
    setLoginStat(false);
  }

  useEffect(() => {
    if (localStorage.getItem("author")) {
      setLoginStat(true);
    } else {
      setLoginStat(false);
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <div className="tuskApp">
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                  <img src="/tusk_ico.png" alt="ico_logo" className="icoLogo" />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  TUSK
                </Typography>
                {regStat ? (
                  <Button color="inherit" onClick={toggleLoginHandler}>
                    Register
                  </Button>
                ) : (
                  ""
                )}
                {loginStat ? (
                  <Button color="inherit" onClick={logoutHandler}>
                    Logout
                  </Button>
                ) : (
                  ""
                )}
              </Toolbar>
            </AppBar>
          </Box>
          <Box sx={{ flexGrow: 1 }} className="mainBody">
            {loginStat ? <Tasks /> : <Login regStat={regStat} setRegStat={setRegStat} toggleLoginHandler={toggleLoginHandler} loginStat={loginStat} setLoginStat={setLoginStat} />}
          </Box>
        </div>
        <Footer />
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
