import React, { useCallback, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  Paper,
  IconButton,
  makeStyles,
  Grid,
  Chip,
  ButtonGroup,
  InputBase,
  withStyles,
  useTheme,
  fade,
} from "@material-ui/core";

import {
  FirstPage,
  LastPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Search,
  LockOpenTwoTone,
  MoreTwoTone,
  LockTwoTone,
} from "@material-ui/icons";

import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";

import routes from "../routes/routes.json";
import noResultImage from "../images/no-result-nb.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& .MuiTextField-root": {
      marginTop: theme.spacing(1),
    },
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
        ? window.innerHeight - 50
        : document.documentElement.offsetHeight - 50,
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
  closeIssueBtn: {
    color: theme.palette.error.main,
  },
  openIssueBtn: {
    color: theme.palette.success.main,
  },
  viewBtn: {
    color: theme.palette.info.main,
  },
}));

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
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

  const handleFirstPageButtonClick = (e) => {
    onChangePage(e, 0);
  };

  const handleBackButtonClick = (e) => {
    onChangePage(e, page - 1);
  };

  const handleNextButtonClick = (e) => {
    onChangePage(e, page + 1);
  };

  const handleLastPageButtonClick = (e) => {
    onChangePage(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
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

const IssueTable = (props) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState(props.rows);
  const history = useHistory();
  const goto = useCallback((path) => history.push(path), [history]);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleSearchInput = (e) => {
    if (
      e.target.value !== "" &&
      e.target.value !== null &&
      e.target.value !== undefined
    ) {
      let filtered_list = [];
      props.rows.filter((item) => {
        if (item.title.toString().indexOf(e.target.value) >= 0) {
          filtered_list.push(item);
        }
        return 0;
      });
      setRows(filtered_list);
    } else {
      setRows(props.rows);
    }
  };

  useEffect(() => {
    setRows(props.rows);
  }, [props.rows]);

  return (
    <div style={{ width: "100%" }}>
      <Grid container style={{ marginBottom: 10 }}>
        <Grid item xs={10} md={4}>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search />
            </div>
            <InputBase
              placeholder="Search by title…"
              value={null}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              onChange={handleSearchInput}
              inputProps={{ "aria-label": "search" }}
            />
          </div>
        </Grid>
        <Grid item md={6}></Grid>
        <Grid item md={2}></Grid>
      </Grid>
      {rows.length > 0 ? (
        <TableContainer component={Paper} className={classes.table}>
          <Table aria-label="issue table">
            <TableHead>
              <TableRow>
                <StyledTableCell>IID</StyledTableCell>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell>Priority</StyledTableCell>
                <StyledTableCell align="right">Assignee</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log(rows)}
              {page * rowsPerPage > rows.length ? setPage(0) : null}
              {(rowsPerPage > 0
                ? rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((row) => (
                <StyledTableRow key={row.iid}>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    style={{ width: "50" }}
                  >
                    {row.iid}
                  </StyledTableCell>
                  <StyledTableCell style={{ width: 350, overflowX: "hidden" }}>
                    <Link
                      onClick={() => {
                        goto(
                          routes.PROJECTS_VIEW_X +
                            props.pId +
                            routes.ISSUE_VIEW_X +
                            row.iid
                        );
                      }}
                    >
                      {row.title}
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell style={{ width: 100 }}>
                    {Number(row.type) === 1
                      ? "NONE"
                      : Number(row.type) === 2
                      ? "BUG"
                      : Number(row.type) === 3
                      ? "TO TEST"
                      : Number(row.type) === 4
                      ? "SECURITY"
                      : "OTHER"}
                  </StyledTableCell>
                  <StyledTableCell style={{ width: 150 }}>
                    {Number(row.priority) === 1 ? (
                      <Chip
                        size="small"
                        label="none"
                        variant="outlined"
                        className={classes.tag_none}
                      />
                    ) : Number(row.priority) === 2 ? (
                      <Chip
                        size="small"
                        label="low"
                        variant="outlined"
                        className={classes.tag_low}
                      />
                    ) : Number(row.priority) === 3 ? (
                      <Chip
                        size="small"
                        label="normal"
                        variant="outlined"
                        className={classes.tag_normal}
                      />
                    ) : Number(row.priority) === 4 ? (
                      <Chip
                        size="small"
                        label="high"
                        variant="outlined"
                        className={classes.tag_high}
                      />
                    ) : (
                      <Chip
                        size="small"
                        label="critical"
                        variant="outlined"
                        className={classes.tag_critical}
                      />
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.assignedTo === null || Number(row.assignedTo) === -1
                      ? "None"
                      : row.assignedTo}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <ButtonGroup disableElevation variant="contained">
                      <IconButton size="small">
                        <MoreTwoTone
                          fontSize="small"
                          className={classes.viewBtn}
                        />
                      </IconButton>
                      {Number(row.isOpen) === 1 ? (
                        <IconButton size="small" title="Open this Issue">
                          <LockOpenTwoTone
                            fontSize="small"
                            className={classes.openIssueBtn}
                          />
                        </IconButton>
                      ) : (
                        <IconButton size="small" title="Close this Issue">
                          <LockTwoTone
                            fontSize="small"
                            className={classes.closeIssueBtn}
                          />
                        </IconButton>
                      )}
                    </ButtonGroup>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
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
      ) : null}
      {emptyRows === rowsPerPage && (
        <Grid container justify="center">
          <Grid item>
            <img src={noResultImage} alt="Data Not Found" width="100%" />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default IssueTable;
