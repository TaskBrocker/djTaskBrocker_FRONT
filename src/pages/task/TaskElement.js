import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
// import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { TaskElementForm } from '../../sections/@dashboard/task/element';

import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { FormProvider } from '../../components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// ----------------------------------------------------------------------
import { LoadingButton } from '@mui/lab';
import { FormProvider as FormA} from 'react-hook-form';
// ----------------------------------------------------------------------
// import { useNavigate } from 'react-router-dom';
// import { PATH_DASHBOARD } from '../../routes/paths';
// ----------------------------------------------------------------------

export default function UserCreate() {
  
  //const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  // const isEdit = pathname.includes('edit');
  const isEdit = false;

  const currentUser = _userList.find((user) => paramCase(user.name) === name);
  // const currentUser = '';

  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required('Code is required'),
    code2: Yup.string().required('Code is required'),
    code3: Yup.string().required('Code is required'),
    code4: Yup.string().required('Code is required'),
    code5: Yup.string().required('Code is required'),
    code6: Yup.string().required('Code is required'),
  });

  const defaultValues = {
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: '',
  };

  const methods = useForm({
    //mode: 'all',
    //resolver: yupResolver(VerifyCodeSchema),
    //defaultValues,
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log('Change task start');

    await fetch("/tb/api/get-list").then((response) => response.json()).then((json) => console.log(json))

    /*
    fetch("/tb/api/delete-task-job-by-uuid", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uuid: 'cd5d3b6e-cedc-11ec-98b4-2f57d7e7445e'})
    }).then((response) => console.log(response.json()))
    */

    //navigate(PATH_DASHBOARD.task.list);

    // var fetched = await fetch("/tb/api/get-list");

    // console.log(fetched);

    console.log('Change task end')

    /*
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
    */

    /*
    fetch("/tb/api/delete-task-job-by-uuid", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uuid: 'cd5d3b6e-cedc-11ec-98b4-2f57d7e7445e'})
    }).then((response) => console.log(response.json()))
    */

  }

  return (
    //<FormProvider methods={methods}>
      <Page title="Task: Create a new task">
        {/*<Container maxWidth={themeStretch ? false : 'lg'}>*/}
        <Container>
          
          <HeaderBreadcrumbs
            heading={!isEdit ? 'Create a task' : 'Edit task'}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Task', href: PATH_DASHBOARD.task.list },
              { name: !isEdit ? 'New task' : capitalCase(name) },
            ]}
          />


          <TaskElementForm isEdit={isEdit} currentUser={currentUser} />
        </Container>
      </Page>
    //</FormProvider>
  );
 }