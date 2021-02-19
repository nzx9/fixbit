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
  Button,
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
  LockOpen,
  Lock,
  MoreHoriz,
} from "@material-ui/icons";

import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";

import routes from "../routes/routes.json";
import noResultImage from "../images/no-result-nb.png";
import {
  Info,
  InfoCaption,
  InfoSubtitle,
  InfoTitle,
} from "@mui-treasury/components/info";
import { useApexInfoStyles } from "@mui-treasury/styles/info/apex";
import config from "../components/config.json";
import { httpReq } from "../components/httpRequest";
import { NOTIFY, snackPosition } from "../components/notify";
import { useSnackbar } from "notistack";

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
    backgroundColor: fade(theme.palette.text.secondary, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.text.secondary, 0.25),
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
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  closeIssueBtn: {
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      color: theme.palette.error.main,
    },
  },
  openIssueBtn: {
    backgroundColor: theme.palette.success.main,
    "&:hover": {
      color: theme.palette.success.main,
    },
  },
  viewBtn: {
    color: theme.palette.info.main,
  },
  infoPrimary: {
    color: theme.palette.text.primary,
  },
  infoSecondary: {
    color: theme.palette.text.secondary,
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
  const { enqueueSnackbar } = useSnackbar();

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
        if (
          item.title
            .toString()
            .toLowerCase()
            .indexOf(e.target.value.toString().toLowerCase()) >= 0
        ) {
          filtered_list.push(item);
        }
        return 0;
      });
      setRows(filtered_list);
    } else {
      setRows(props.rows);
    }
  };

  const findNameOfAssignee = (projectInfo, assign_to, uid) => {
    let name = null;
    if (projectInfo.team.members === null) {
      if (assign_to === uid && projectInfo.admin.id === uid)
        return (
          <InfoSubtitle className={classes.infoSecondary}>
            {projectInfo.admin.username}
            <b>&nbsp;(Me)</b>
          </InfoSubtitle>
        );
      else if (assign_to === projectInfo.admin.id)
        return (
          <InfoSubtitle className={classes.infoSecondary}>
            {projectInfo.admin.username}
            <b>&nbsp;(Admin)</b>
          </InfoSubtitle>
        );
      else
        return (
          <InfoSubtitle className={classes.infoSecondary}>
            <em>Unknown</em>
          </InfoSubtitle>
        );
    } else {
      projectInfo.team.members.forEach((value) => {
        if (value.uid === assign_to) {
          if (Number(uid) === value.uid) {
            name = (
              <InfoSubtitle className={classes.infoSecondary}>
                {value.name}
                <b>&nbsp;(Me)</b>
              </InfoSubtitle>
            );
            return;
          } else {
            name = value.name;
            return;
          }
        }
      });
      return name === null ? (
        <InfoSubtitle className={classes.infoSecondary}>
          <em>
            <b>Unknown</b>
          </em>
        </InfoSubtitle>
      ) : (
        name
      );
    }
  };

  useEffect(() => {
    setRows(props.rows);
    if (props.newIssue) {
      setPage(Math.max(0, Math.ceil(props.rows.length / rowsPerPage) - 1));
      props.noNewIssue();
    }
  }, [props.rows]);

  return (
    <div style={{ width: "100%" }}>
      <Info useStyles={useApexInfoStyles}>
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
                  <StyledTableCell>
                    <InfoCaption>iid</InfoCaption>
                  </StyledTableCell>
                  <StyledTableCell>
                    <InfoCaption>title</InfoCaption>
                  </StyledTableCell>
                  <StyledTableCell>
                    <InfoCaption>type</InfoCaption>
                  </StyledTableCell>
                  <StyledTableCell>
                    <InfoCaption>priority</InfoCaption>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <InfoCaption>assignee</InfoCaption>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <InfoCaption>actions&ensp;</InfoCaption>
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {page * rowsPerPage > rows.length ? setPage(0) : null}
                {(rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rows
                ).map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      style={{ width: "50" }}
                    >
                      <InfoSubtitle className={classes.infoSecondary}>
                        <b>{row.id}</b>
                      </InfoSubtitle>
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ width: 350, overflowX: "hidden" }}
                    >
                      <Link
                        onClick={() => {
                          goto(
                            routes.PROJECTS_VIEW_X +
                              props.pId +
                              routes.ISSUE_VIEW_X +
                              row.id
                          );
                        }}
                      >
                        <InfoTitle className={classes.infoSecondary}>
                          {row.title}
                        </InfoTitle>
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: 100 }}>
                      <InfoSubtitle className={classes.infoSecondary}>
                        {Number(row.type) === 0
                          ? "NONE"
                          : Number(row.type) === 1
                          ? "BUG"
                          : Number(row.type) === 2
                          ? "TO TEST"
                          : Number(row.type) === 3
                          ? "SECURITY"
                          : "OTHER"}
                      </InfoSubtitle>
                    </StyledTableCell>
                    <StyledTableCell style={{ width: 150 }}>
                      {Number(row.priority) === 0 ? (
                        <Chip
                          size="small"
                          label="none"
                          variant="outlined"
                          className={classes.tag_none}
                        />
                      ) : Number(row.priority) === 1 ? (
                        <Chip
                          size="small"
                          label="low"
                          variant="outlined"
                          className={classes.tag_low}
                        />
                      ) : Number(row.priority) === 2 ? (
                        <Chip
                          size="small"
                          label="normal"
                          variant="outlined"
                          className={classes.tag_normal}
                        />
                      ) : Number(row.priority) === 3 ? (
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
                      {row.assign_to === null ? (
                        <InfoSubtitle className={classes.infoSecondary}>
                          <em>
                            <b>None</b>
                          </em>
                        </InfoSubtitle>
                      ) : (
                        findNameOfAssignee(
                          props.projectInfo,
                          row.assign_to,
                          props.uId
                        )
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <ButtonGroup
                        disableElevation
                        variant="contained"
                        style={{ marginRight: 0 }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            goto(
                              routes.PROJECTS_VIEW_X +
                                props.pId +
                                routes.ISSUE_VIEW_X +
                                row.id
                            );
                          }}
                        >
                          <MoreHoriz fontSize="small" />
                        </Button>
                        {Boolean(row.is_open) === false ? (
                          <Button
                            size="small"
                            variant="outlined"
                            className={classes.openIssueBtn}
                            title="Re-Open this Issue"
                            onClick={() => {
                              httpReq(
                                `${config.URL}/api/projects/${props.projectInfo.project.id}/issues/${row.id}`,
                                "PUT",
                                {
                                  is_open: true,
                                },
                                props.token
                              )
                                .then((res) => {
                                  res.json().then((r) => {
                                    NOTIFY(r.msg, (msg) => {
                                      enqueueSnackbar(msg, {
                                        variant: r.type,
                                        anchorOrigin: snackPosition(),
                                      });
                                      if (
                                        res.status === 200 &&
                                        r.success === true
                                      ) {
                                        props.action();
                                      }
                                    });
                                  });
                                })
                                .catch((err) => console.error(err));
                            }}
                          >
                            <LockOpen fontSize="small" />
                          </Button>
                        ) : (
                          <Button
                            className={classes.closeIssueBtn}
                            size="small"
                            variant="outlined"
                            title="Close this Issue"
                            onClick={() => {
                              httpReq(
                                `${config.URL}/api/projects/${props.projectInfo.project.id}/issues/${row.id}`,
                                "PUT",
                                {
                                  is_open: false,
                                },
                                props.token
                              )
                                .then((res) => {
                                  res.json().then((r) => {
                                    NOTIFY(r.msg, (msg) => {
                                      enqueueSnackbar(msg, {
                                        variant: r.type,
                                        anchorOrigin: snackPosition(),
                                      });
                                      if (
                                        res.status === 200 &&
                                        r.success === true
                                      ) {
                                        props.action();
                                      }
                                    });
                                  });
                                })
                                .catch((err) => console.error(err));
                            }}
                          >
                            <Lock fontSize="small" />
                          </Button>
                        )}
                      </ButtonGroup>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    style={{ width: "100%" }}
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
        ) : null}
        {emptyRows === rowsPerPage && (
          <Grid container justify="center">
            <Grid item>
              <img src={noResultImage} alt="Data Not Found" width="100%" />
            </Grid>
          </Grid>
        )}
      </Info>
    </div>
  );
};

export default IssueTable;
