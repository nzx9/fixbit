import React from "react";

import {
  Container,
  Paper,
  makeStyles,
  Grid,
  Typography,
  Backdrop,
  CircularProgress,
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  ButtonGroup,
  Popover,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  InputBase,
  withStyles,
  useTheme,
  fade,
} from "@material-ui/core";

import {
  Settings,
  ArrowDownward,
  FirstPage,
  LastPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Search,
} from "@material-ui/icons";

import { AvatarGroup } from "@material-ui/lab";

import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      marginTop: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  typography: {
    padding: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: theme.palette.primary.main,
  },
  tag_critical: {
    color: theme.palette.error.dark,
    borderColor: theme.palette.error.dark,
  },
  tag_high: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
  tag_normal: {
    color: theme.palette.warning.main,
    borderColor: theme.palette.warning.main,
  },
  tag_low: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
  },
  tag_no: {
    color: theme.palette.text.primary,
    borderColor: theme.palette.text.primary,
  },
  table: {
    maxHeight:
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(0),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    border: "1px solid black",
    borderRadius: 10,
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
      </IconButton>
    </div>
  );
}

const project_name = "Apollo 11";
const project_description =
  "This project description is an used only for test porpose";
const team_members = ["navindu", "sandul", "jennive", "gowrisha"];

const ViewProject = () => {
  const classes = useStyles();
  const [_openBackdrop, _setOpenBackdrop] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleDescriptionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const priority_list = [
    {
      name: "Critical",
      tag: "critical",
      cls: classes.tag_critical,
      nos: 2,
    },
    {
      name: "High Priority",
      tag: "high",
      cls: classes.tag_high,
      nos: 10,
    },
    {
      name: "Normal Priority",
      tag: "normal",
      cls: classes.tag_normal,
      nos: 100,
    },
    {
      name: "Low Priority",
      tag: "low",
      cls: classes.tag_low,
      nos: 120,
    },
    {
      name: "No Priority",
      tag: "none",
      cls: classes.tag_no,
      nos: 3,
    },
  ];

  return (
    <Container component="main" maxWidth="xl">
      <Backdrop className={classes.backdrop} open={_openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container spacing={1}>
        <Grid item md={3}>
          <Paper className={classes.paper}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={9}>
                    <Typography variant="h5">{project_name}</Typography>
                    <Popover
                      id={"description"}
                      open={Boolean(anchorEl)}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <Typography className={classes.typography}>
                        {project_description}
                      </Typography>
                    </Popover>
                  </Grid>
                  <Grid item xs={3}>
                    <ButtonGroup disableElevation variant="contained">
                      <IconButton
                        aria-label="description"
                        className={classes.margin}
                        size="small"
                        onClick={handleDescriptionClick}
                      >
                        <ArrowDownward fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        className={classes.margin}
                        size="small"
                      >
                        <Settings fontSize="inherit" />
                      </IconButton>
                    </ButtonGroup>
                  </Grid>
                </Grid>
                <List>
                  <Grid container justify="">
                    <AvatarGroup>
                      {team_members.map((value, index) => {
                        return <Avatar key={index} alt={value} src="_" />;
                      })}
                    </AvatarGroup>
                  </Grid>
                  <br />
                  <Button variant="contained" color="primary" fullWidth>
                    Create
                  </Button>
                </List>
                <Divider />
                <List>
                  {["All"].map((text, index) => (
                    <ListItem
                      button
                      key={text}
                      onClick={() => {
                        alert(text);
                      }}
                    >
                      <ListItemText style={{ width: "80%" }} primary={text} />
                      <ListItemText
                        style={{ maxWidth: "20%", textAlign: "right" }}
                        primary={3}
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider />
                <List>
                  {priority_list.map((value, index) => (
                    <ListItem
                      button
                      key={value.name}
                      onClick={() => {
                        alert(value.name);
                      }}
                    >
                      <ListItemText
                        style={{ minWidth: "40%" }}
                        primary={value.name}
                      />
                      <Chip
                        size="small"
                        label={value.tag}
                        variant="outlined"
                        className={value.cls}
                      />

                      <ListItemText
                        style={{ maxWidth: "15%", textAlign: "right" }}
                        primary={value.nos}
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider />
                <List>
                  {["Assigned to You", "Unassigned", "Closed"].map(
                    (text, index) => (
                      <ListItem
                        button
                        key={text}
                        onClick={() => {
                          alert(text);
                        }}
                      >
                        <ListItemText style={{ width: "80%" }} primary={text} />
                        <ListItemText
                          style={{ maxWidth: "20%", textAlign: "right" }}
                          primary={3}
                        />
                      </ListItem>
                    )
                  )}
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item md={9} style={{ maxHeight: "100%", overflowY: "hidden" }}>
          <Paper className={classes.paper}>
            <Grid container style={{ marginBottom: 10 }}>
              <Grid item xs={4}>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <Search />
                  </div>
                  <InputBase
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ "aria-label": "search" }}
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                x2
              </Grid>
              <Grid item xs={2}></Grid>
            </Grid>
            <TableContainer component={Paper} className={classes.table}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Dessert (100g serving)</StyledTableCell>
                    <StyledTableCell align="right">Calories</StyledTableCell>
                    <StyledTableCell align="right">
                      Fat&nbsp;(g)
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Carbs&nbsp;(g)
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      Protein&nbsp;(g)
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? rows.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : rows
                  ).map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell component="th" scope="row">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.calories}
                      </StyledTableCell>
                      <StyledTableCell align="right">{row.fat}</StyledTableCell>
                      <StyledTableCell align="right">
                        {row.carbs}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.protein}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: -1 },
                      ]}
                      colSpan={3}
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: { "aria-label": "rows per page" },
                        native: true,
                      }}
                      onChangePage={handleChangePage}
                      onChangeRowsPerPage={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewProject;
