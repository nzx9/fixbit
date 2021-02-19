import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  IconButton,
  FormHelperText,
  Link,
  makeStyles,
  withStyles,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import { Cancel, FiberManualRecord } from "@material-ui/icons";
import { httpReq } from "../components/httpRequest";
import { DEBUG_PRINT } from "../components/debugTools";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import config from "../components/config.json";
import { NOTIFY, snackPosition } from "../components/notify";
import { getToken } from "../reducers/tokenTracker";
import { getUId } from "../reducers/userDataTracker";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.error.main,
  },
});

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  gridContainer: {
    marginBottom: theme.spacing(2),
  },
  tag_critical: {
    color: theme.palette.error.dark,
    borderColor: theme.palette.error.dark,
    fontSize: 15,
  },
  tag_high: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    fontSize: 15,
  },
  tag_normal: {
    color: theme.palette.warning.main,
    borderColor: theme.palette.warning.main,
    fontSize: 15,
  },
  tag_low: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
    fontSize: 15,
  },
  tag_no: {
    color: theme.palette.text.primary,
    fontSize: 15,
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <Cancel />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

function IssueCreateDialog(props) {
  const classes = useStyles();

  const uId = useSelector(getUId);
  const token = useSelector(getToken);

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(true);
  const [assignTo, setAssignTo] = React.useState(-1);
  const [priority, setPriority] = React.useState(2);
  const [type, setType] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleIsOpenChange = (e) => {
    setIsOpen(e.target.value);
  };
  const handleAssignToChange = (e) => {
    setAssignTo(e.target.value);
  };
  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };
  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        fullWidth
      >
        Create Issue
      </Button>
      <Dialog
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="sm"
        fullWidth
      >
        <form
          className={classes.root}
          validate="true"
          autoComplete="on"
          onSubmit={(e) => {
            props.setOpenBackdrop(true);
            let data = {
              title: title,
              description: description,
              priority: priority,
              type: type,
              is_open: isOpen,
            };
            if (assignTo === -1) {
              data["assign_to"] = null;
            } else {
              data["assign_to"] = assignTo;
            }
            httpReq(
              `${config.URL}/api/projects/${props.pId}/issues`,
              "POST",
              data,
              token
            )
              .then((res) => {
                DEBUG_PRINT(res);
                res.json().then((r) => {
                  NOTIFY(r.msg, (msg) => {
                    if (msg === null || msg === undefined) msg = r.message;
                    props.setOpenBackdrop(false);
                    enqueueSnackbar(msg, {
                      variant: r.type,
                      anchorOrigin: snackPosition(),
                    });
                    if (res.status === 201 && r.success === true) {
                      props.action();
                      props.newIssue();
                    }
                  });
                });
              })
              .catch((err) => {
                props.setOpenBackdrop(false);
                alert(err);
              });
            setOpen(false);
            e.preventDefault();
          }}
        >
          <DialogTitle
            disableTypography
            className={classes.root}
            onClose={handleClose}
          >
            New Issue
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={1} className={classes.gridContainer}>
              <Grid item xs={12} md={9}>
                <TextField
                  variant="outlined"
                  label="Title"
                  onChange={handleTitleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  fullWidth
                  required
                >
                  <InputLabel id="isOpen-select">Open/Close</InputLabel>
                  <Select
                    labelId="isOpen-select"
                    id="isOpen-select"
                    value={isOpen}
                    onChange={handleIsOpenChange}
                    label="Open/Close"
                    required
                  >
                    <MenuItem value={true}>Open</MenuItem>
                    <MenuItem value={false}>Close</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container className={classes.gridContainer}>
              <Grid item xs={12}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  style={{ marginTop: 5 }}
                >
                  <TextField
                    id="description-input"
                    label="Description"
                    multiline
                    variant="outlined"
                    fullWidth
                    onChange={handleDescriptionChange}
                    required
                    aria-describedby="description-input-helper-text"
                  />
                  <FormHelperText id="description-input-helper-text">
                    <Link
                      href="https://guides.github.com/features/mastering-markdown/"
                      target="_blank"
                    >
                      Markdown
                    </Link>{" "}
                    Supported
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container className={classes.gridContainer} spacing={1}>
              <Grid item xs={12} md={6}>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  fullWidth
                  required
                >
                  <InputLabel id="isOpen-select">Assign To</InputLabel>
                  <Select
                    labelId="isOpen-select"
                    id="isOpen-select"
                    value={assignTo}
                    onChange={handleAssignToChange}
                    label="Open/Close"
                    required
                  >
                    <MenuItem index={-1} value={-1}>
                      <b>Not Assign</b>
                    </MenuItem>
                    {props.projectInfo.team.members !== null ? (
                      props.projectInfo.team.members.map((value, index) =>
                        value.uid === uId ? (
                          <MenuItem key={index} value={value.uid}>
                            {value.name}&nbsp;<b>(Me)</b>
                          </MenuItem>
                        ) : value.uid === props.projectInfo.admin.id ? (
                          <MenuItem key={index} value={value.uid}>
                            {value.name}&nbsp;<b>(Admin)</b>
                          </MenuItem>
                        ) : (
                          <MenuItem key={index} value={value.uid}>
                            {value.name}
                          </MenuItem>
                        )
                      )
                    ) : props.projectInfo.admin.id === uId ? (
                      <MenuItem value={props.projectInfo.admin.id}>
                        {props.projectInfo.admin.username}&nbsp;<b>(Me)</b>
                      </MenuItem>
                    ) : (
                      <MenuItem value={props.projectInfo.admin.id}>
                        {props.projectInfo.admin.username}&nbsp;<b>(Admin)</b>
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={3}>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  fullWidth
                  required
                >
                  <InputLabel id="isOpen-select">Priority</InputLabel>
                  <Select
                    labelId="isOpen-select"
                    id="isOpen-select"
                    value={priority}
                    onChange={handlePriorityChange}
                    label="Priority"
                    required
                  >
                    <MenuItem value={0}>
                      <Grid container>
                        <Grid item xs={9}>
                          None
                        </Grid>
                        <Grid item xs={3}>
                          <FiberManualRecord className={classes.tag_no} />
                        </Grid>
                      </Grid>
                    </MenuItem>
                    <MenuItem value={1}>
                      <Grid container>
                        <Grid item xs={9}>
                          Low
                        </Grid>
                        <Grid item xs={3}>
                          <FiberManualRecord className={classes.tag_low} />
                        </Grid>
                      </Grid>
                    </MenuItem>
                    <MenuItem value={2}>
                      <Grid container>
                        <Grid item xs={9}>
                          Normal
                        </Grid>
                        <Grid item xs={3}>
                          <FiberManualRecord className={classes.tag_normal} />
                        </Grid>
                      </Grid>
                    </MenuItem>
                    <MenuItem value={3}>
                      <Grid container>
                        <Grid item xs={9}>
                          High
                        </Grid>
                        <Grid item xs={3}>
                          <FiberManualRecord className={classes.tag_high} />
                        </Grid>
                      </Grid>
                    </MenuItem>
                    <MenuItem value={4}>
                      <Grid container>
                        <Grid item xs={9}>
                          Critical
                        </Grid>
                        <Grid item xs={3}>
                          <FiberManualRecord className={classes.tag_critical} />
                        </Grid>
                      </Grid>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={3}>
                <FormControl
                  variant="outlined"
                  className={classes.formControl}
                  fullWidth
                  required
                >
                  <InputLabel id="isOpen-select">Type</InputLabel>
                  <Select
                    labelId="isOpen-select"
                    id="isOpen-select"
                    value={type}
                    onChange={handleTypeChange}
                    label="Type"
                    required
                  >
                    <MenuItem value={0}>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={1}>Bug</MenuItem>
                    <MenuItem value={2}>To Test</MenuItem>
                    <MenuItem value={3}>Security</MenuItem>
                    <MenuItem value={4}>Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" autoFocus color="primary">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default IssueCreateDialog;
