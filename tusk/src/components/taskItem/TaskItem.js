import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { useState, useEffect, useContext } from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import Alert from "@mui/material/Alert";

//Context Imports
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";

import "./TaskItem.css";
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

export default function TaskItem(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [bucket, setBucket] = useState("");

  function itemDeleteHandler(e) {
    let postid = e.currentTarget.value;
    Axios.post("http://localhost:5000/deltask", { id: postid })
      .then(res => {
        //console.log(res);
        getAllTaskData();
        setTaskListLoad(appState.taskList);
      })
      .catch(err => console.log(err));
  }

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

  const [singlTask, setSingleTask] = useState(initialTaskVals);
  const [open, setOpen] = useState(false);
  const itemUpdateHandler = e => {
    setSingleTask(JSON.parse(e.currentTarget.value));
    //console.log(singlTask);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const [dueDateVal, setDueDateVal] = useState(null);

  function inputValChangeHandler(e) {
    const { name, value } = e.target;
    setSingleTask({
      ...singlTask,
      createdDate: new Date(),
      [name]: value
    });
    console.log(singlTask);
  }

  function taskStatHandler(e) {
    setSingleTask({
      ...singlTask,
      status: e.target.checked
    });
  }

  const [taskSuccess, setTaskSuccess] = useState();

  function updateTaskHandeler() {
    //console.log(singlTask);
    Axios.post("http://localhost:5000/updatetask", singlTask)
      .then(res => {
        getAllTaskData();
        setTaskSuccess(res.data);
        setTimeout(function () {
          setTaskSuccess(undefined);
        }, 3000);
        setSingleTask(initialTaskVals);
        setOpen(false);
      })
      .catch(err => console.log(err));
  }

  const [taskListLoad, setTaskListLoad] = useState(appState.taskList);

  const buttons = [
    <Button key="all" onClick={allFilterHandler}>
      All
    </Button>,
    <Button key="one" onClick={highFilterHandler}>
      High
    </Button>,
    <Button key="two" onClick={midFilterHandler}>
      Medium
    </Button>,
    <Button key="three" onClick={lowFilterHandler}>
      Low
    </Button>
  ];

  function highFilterHandler() {
    let highFilteredList = taskListLoad.filter(item => {
      return item.priority == 1;
    });
    appDispatch({ type: "tasklist-updated", data: highFilteredList });
  }

  function midFilterHandler() {
    let midFilteredList = taskListLoad.filter(item => {
      return item.priority == 2;
    });
    appDispatch({ type: "tasklist-updated", data: midFilteredList });
  }

  function lowFilterHandler() {
    let lowFilteredList = taskListLoad.filter(item => {
      return item.priority == 3;
    });
    appDispatch({ type: "tasklist-updated", data: lowFilteredList });
  }

  function allFilterHandler() {
    appDispatch({ type: "tasklist-updated", data: taskListLoad });
  }

  const handleBucketChange = event => {
    let bucketFilterList = taskListLoad.filter(item => {
      return item.bucket == event.target.value;
    });
    appDispatch({ type: "tasklist-updated", data: bucketFilterList });
    setBucket(event.target.value);
  };

  const [bucketList, setBucketList] = useState([]);

  function getAllBucket() {
    Axios.post("http://localhost:5000/getallbuckets", { email: useremail })
      .then(res => {
        setBucketList(res.data);
      })
      .catch(err => console.log(err));
  }

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

  useEffect(() => {
    getAllBucket();
  }, []);

  return (
    <div className="taskItemContainer">
      <Grid container>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel>Select Bucket</InputLabel>
            <Select id="bucketSelct" value={bucket} label="Select Bucket" onChange={handleBucketChange} size="small">
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
        <Grid item xs={5}></Grid>
        <Grid item xs={4} sx={{ textAlign: "right" }}>
          <ButtonGroup color="secondary" aria-label="medium secondary button group">
            {buttons}
          </ButtonGroup>
        </Grid>
      </Grid>
      <List sx={{ width: "100%", bgcolor: "#dfdedd" }}>
        {appState.taskList.map(value => {
          let priority;
          if (value.priority == 1) {
            priority = "high";
          } else if (value.priority == 2) {
            priority = "Medium";
          } else {
            priority = "Low";
          }

          return (
            <ListItem key={value._id} disablePadding>
              <ListItemButton role={undefined}>
                <ListItemIcon>
                  <DoubleArrowIcon />
                </ListItemIcon>
                <ListItemText primary={value.taskDesc} secondary={`Created on: ${value.createdDate}`} />
                <Stack direction="row" spacing={1}>
                  <Chip icon={<DonutLargeIcon />} label={value.status ? "Completed" : "Pending"} />
                  <Chip icon={<ExpandLessIcon />} label={priority} />
                  <Chip icon={<HourglassBottomIcon />} label={value.dueDate} />
                </Stack>
                <IconButton edge="end" aria-label="edit" onClick={itemUpdateHandler} value={JSON.stringify(value)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={itemDeleteHandler} value={value._id}>
                  <DeleteIcon sx={{ color: "#a93636" }} />
                </IconButton>
              </ListItemButton>
            </ListItem>
          );
        })}

        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Typography variant="h6" component="h2" gutterBottom>
              Update Task Settings
            </Typography>
            <Box className="taskSetInpArea">
              <TextField label="Update Task Description" value={singlTask.taskDesc} name="taskDesc" size="small" variant="outlined" onChange={inputValChangeHandler} />
            </Box>
            <Box className="taskSetInpArea">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Due Date"
                  value={singlTask.dueDate}
                  onChange={newValue => {
                    setDueDateVal(newValue);
                    setSingleTask({
                      ...singlTask,
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
                <RadioGroup row aria-label="priority" name="priority" value={singlTask.priority} onChange={inputValChangeHandler}>
                  <FormControlLabel value="1" control={<Radio />} label="High" />
                  <FormControlLabel value="2" control={<Radio />} label="Medium" />
                  <FormControlLabel value="3" control={<Radio />} label="Low" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box className="taskSetInpArea">
              <Grid container>
                <Grid item xs={5}>
                  <TextField label="Enter a new Bucket name" name="bucketName" value={bucketkValue.bucketName} id="new-bucket" size="small" variant="outlined" onChange={backetInputChange} />
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
                    <Select id="bucketSelct" name="bucket" value={singlTask.bucket} label="Select Bucket" size="small" onChange={inputValChangeHandler}>
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
            <Box className="taskSetInpArea">
              <FormGroup>
                <FormControlLabel control={<Switch checked={singlTask.status} onChange={taskStatHandler} color="warning" />} label="Complete Status" />
              </FormGroup>
            </Box>
            <Box className="modalAction">
              <Button size="medium" variant="contained" onClick={updateTaskHandeler}>
                Update Task
              </Button>
            </Box>
          </Box>
        </Modal>
      </List>
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
