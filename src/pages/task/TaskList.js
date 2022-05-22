// ----------
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
//import { Link as RouterLink } from 'react-router-dom';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from '../../routes/paths';
// material
import {
  Modal, 
  Box,
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound';
import { TaskListHead, TaskListToolbar, TaskListPopMenu } from '../../sections/@dashboard/task';
// --------
import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
// ----------------------------------------------------------------------
import PropTypes from 'prop-types';
// ----------------------------------------------------------------------
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// ----------------------------------------------------------------------
import { ModalErrorWindow } from '../../components/modals'


const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'id_name', label: 'ID Name', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'trigger', label: 'Trigger type', alignRight: false },
  { id: 'execute', label: 'Execute', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function TaskList() {
  const [ActualeDATA, setActualeDATA] = useState(new Date());
  const [USERLIST, setUSERLIST] = useState([]);

  const navigate = useNavigate();

  //-----------------------------------------------
  //-----------------------------------------------
  //-----------------------------------------------

  const [error, setError] = useState(false);
  const [errorDiscription, setErrorDiscription] = useState('Unknown ERROR.');

  //-----------------------------------------------
  //-----------Start TASK-------------------------
  //-----------------------------------------------

  function handleStartTask(inUUID) {
    StartTask(inUUID);
  };

  async function StartTask(inUUID) {
    let response = await fetch("/tb/api/start-job-by-uuid", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uuid: inUUID})
    })

    if (response.status != 200) {
      let responseJSON = await response.json()

      setErrorDiscription(responseJSON.discription);
      setError(true);
    } else {
      setActualeDATA(new Date());
    }
  };

  //-----------------------------------------------
  //-----------Stop TASK---------------------------
  //-----------------------------------------------

  function handleStopTask(inUUID) {
    StopTask(inUUID);
  };

  async function StopTask(inUUID) {
    let response = await fetch("/tb/api/stop-job-by-uuid", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uuid: inUUID})
    })

    if (response.status != 200) {
      let responseJSON = await response.json()

      setErrorDiscription(responseJSON.discription);
      setError(true);
    } else {
      setActualeDATA(new Date());
    }
  };

  //-----------------------------------------------
  //-----------Delete TASK-------------------------
  //-----------------------------------------------
  
  async function handleConfirmDeleteRow() {
    DeleteTask(uuidElement);

    closeConformationModal();
  }

  function handleDeleteTask(inUUID) {
    setUuidElement(inUUID)
    setOpenModal(true);
  };

  async function DeleteTask(inUUID) {
    let testUUID = inUUID;

    let response = await fetch("/tb/api/delete-task-job-by-uuid", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uuid: testUUID})
    })

    if (response.status != 200) {
      let responseJSON = await response.json()

      setErrorDiscription(responseJSON.discription);
      setError(true);
    } else {
      setActualeDATA(new Date());
    }
  }

  function closeConformationModal() {
    setOpenModal(false)
  }

  //-----------------------------------------------
  //-----------------------------------------------

  useEffect(() => {
    fetch("/tb/api/get-list")
    .then((response) => response.json())
    .then((json) => setUSERLIST(json.map((curRow, index) => ({
        uuid: curRow.uuid,
        id: faker.datatype.uuid(),
        //avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
        name: curRow.name,
        id_name: curRow.id_name,
        type: curRow.type,
        trigger: curRow.trigger_type,
        execute: curRow.execute,
    })))) 
  }, [ActualeDATA])

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const [openModal, setOpenModal] = useState(false);
  const [uuidElement, setUuidElement] = useState('');
  
  return (
    <>
      <Page title="User">

        <ModalErrorWindow open={error} setOpen={setError} discription={errorDiscription}/>
       
        <Modal open={openModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
          >
            <Typography>Do you really want delete Task?</Typography>
            <Button onClick={handleConfirmDeleteRow}>Yes</Button>
            <Button onClick={closeConformationModal}>No</Button>
          </Box>   
       </Modal>

        <Container>


          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <HeaderBreadcrumbs
                heading={'Task list'}
                links={[
                  { name: 'Dashboard', href: PATH_DASHBOARD.root },
                  { name: 'Task', href: PATH_DASHBOARD.task.list },
                ]}
              />
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => navigate(PATH_DASHBOARD.task.createelement)}>
              New task
            </Button>
          </Stack>

          <Card>
            <TaskListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TaskListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={USERLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, id_name, type, trigger, execute } = row;
                      const isItemSelected = selected.indexOf(name) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              {/*<Avatar alt={name} src={avatarUrl} />*/}
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          {/*<TableCell align="left">{company}</TableCell>*/}
                          <TableCell align="left">{id_name}</TableCell>
                          <TableCell align="left">{type}</TableCell>
                          <TableCell align="left">{trigger}</TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color={execute ? 'success':'error'}>
                              {execute ? 'Active':'Stop'}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <TaskListPopMenu 
                              row={row}
                              onStartTask = {() => {handleStartTask(row.uuid)}}
                              onStopTask = {() => {handleStopTask(row.uuid)}}
                              onDeleteRow = {() => {handleDeleteTask(row.uuid)}}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={USERLIST.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>

      </Page>
    </>
  );
}
