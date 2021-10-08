import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import Alert from "@mui/material/Alert";

//Context Imports
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";

import "./Tasks.css";

import TaskItem from "../taskItem/TaskItem";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "5px"
};

export default function Tasks() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [dueDateVal, setDueDateVal] = useState(null);
  const [bucket, setBucket] = useState("");

  let useremail;

  if (localStorage.getItem("author")) {
    useremail = localStorage.getItem("author");
  } else {
    useremail = "";
  }

  const initialTaskVals = {
    taskDesc: "",
    author: useremail,
    createdDate: "",
    dueDate: "",
    priority: "",
    bucket: "",
    status: false
  };

  const [taskDecErr, setTaskDecErr] = useState();
  const [taskSuccess, setTaskSuccess] = useState();

  const handleOpen = () => {
    if (taskValue.taskDesc !== "") {
      setOpen(true);
    } else {
      setTaskDecErr("Please enter task description");
      setTimeout(function () {
        setTaskDecErr(undefined);
      }, 3000);
    }
  };

  const [taskValue, setTaskValue] = useState(initialTaskVals);

  function inputValChangeHandler(e) {
    const { name, value } = e.target;
    setTaskValue({
      ...taskValue,
      createdDate: new Date(),
      [name]: value
    });
  }

  const handleChange = event => {
    setBucket(event.target.value);
    setTaskValue({
      ...taskValue,
      bucket: event.target.value
    });
  };

  //const [taskList, setTaskList] = useState([]);

  function getAllTaskData() {
    Axios.post("http://localhost:5000/getalltasks", { email: useremail })
      .then(res => {
        res.data.sort((a, b) => {
          return a.priority - b.priority;
        });
        //setTaskList(res.data);
        appDispatch({ type: "tasklist-updated", data: res.data });
      })
      .catch(err => console.log(err));
  }

  const [bucketList, setBucketList] = useState([]);

  function getAllBucket() {
    Axios.post("http://localhost:5000/getallbuckets", { email: useremail })
      .then(res => {
        setBucketList(res.data);
      })
      .catch(err => console.log(err));
  }

  function createTaskHandeler() {
    Axios.post("http://localhost:5000/addtask", taskValue)
      .then(res => {
        getAllTaskData();
        setTaskSuccess(res.data);
        setTimeout(function () {
          setTaskSuccess(undefined);
        }, 3000);
        setTaskValue(initialTaskVals);
        setOpen(false);
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    getAllTaskData();
    getAllBucket();
  }, []);

  const initialBucketVals = {
    bucketName: "",
    author: useremail
  };

  const [bucketkValue, setBucketkValue] = useState(initialBucketVals);

  function backetInputChange(e) {
    const { name, value } = e.target;
    setBucketkValue({
      ...bucketkValue,
      [name]: value
    });
  }

  function createBucketHandler() {
    Axios.post("http://localhost:5000/createbucket", bucketkValue)
      .then(res => {
        console.log(res);
        getAllBucket();
        setBucketkValue(initialBucketVals);
      })
      .catch(err => console.log(err));
  }

  return (
    <div>
      <Card sx={{ minWidth: 450 }} className="taskBody">
        <CardContent>
          <h2>Add or Manage Your Tasks</h2>
          <div className="addTaskBox">
            <Grid container>
              <Grid item xs={11}>
                <TextField name="taskDesc" label="Add New Task" value={taskValue.taskDesc} variant="filled" fullWidth onChange={inputValChangeHandler} />
              </Grid>
              <Grid item xs={1}>
                <Button size="large" variant="contained" onClick={handleOpen}>
                  Create
                </Button>
              </Grid>
            </Grid>
          </div>
        </CardContent>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2" gutterBottom>
            Task Settings
          </Typography>
          <Box className="taskSetInpArea">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Due Date"
                value={dueDateVal}
                onChange={newValue => {
                  setDueDateVal(newValue);
                  setTaskValue({
                    ...taskValue,
                    dueDate: newValue
                  });
                }}
                renderInput={params => <TextField {...params} size="small" />}
              />
            </LocalizationProvider>
          </Box>
          <Box className="taskSetInpArea">
            <FormControl component="fieldset">
              <FormLabel component="legend">Task Priority</FormLabel>
              <RadioGroup row aria-label="priority" name="priority" onChange={inputValChangeHandler}>
                <FormControlLabel value="1" control={<Radio />} label="High" />
                <FormControlLabel value="2" control={<Radio />} label="Medium" />
                <FormControlLabel value="3" control={<Radio />} label="Low" />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box className="taskSetInpArea">
            <Grid container>
              <Grid item xs={5}>
                <TextField label="Enter a new Bucket name" name="bucketName" size="small" value={bucketkValue.bucketName} variant="outlined" onChange={backetInputChange} />
              </Grid>
              <Grid item xs={4}>
                <Button size="small" variant="contained" className="bucketBtn" onClick={createBucketHandler}>
                  Create Bucket
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box className="taskSetInpArea">
            <Grid container>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <InputLabel>Select Bucket</InputLabel>
                  <Select id="bucketSelct" value={bucket} name="bucket" label="Select Bucket" onChange={handleChange} size="small">
                    <MenuItem value={""}>None</MenuItem>
                    {bucketList.length > 0
                      ? bucketList.map((item, key) => (
                          <MenuItem value={item.bucketName} key={key}>
                            {item.bucketName}
                          </MenuItem>
                        ))
                      : ""}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <Box className="modalAction">
            <Button size="medium" variant="contained" onClick={createTaskHandeler}>
              Create Task
            </Button>
          </Box>
        </Box>
      </Modal>
      <Box className="taskListContainer">{appState.taskList.length > 0 ? <TaskItem /> : <h2>No Tasks Added Yet !!</h2>}</Box>
      {taskDecErr ? (
        <Alert severity="error" sx={{ bgcolor: "#cb0606", color: "#fff", marginTop: "1rem" }}>
          {taskDecErr}
        </Alert>
      ) : (
        ""
      )}
      {taskSuccess ? (
        <Alert severity="success" sx={{ bgcolor: "#244225", color: "#fff", marginTop: "1rem" }}>
          {taskSuccess}
        </Alert>
      ) : (
        ""
      )}
    </div>
  );
}
