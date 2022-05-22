import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Button, Modal, Box, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
// utils
import { fData } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
// ----------------------------------------------------------------------
import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------
import { TaskCreate } from '../../../../API_integration';
//------Modals------
import { ModalErrorWindow } from '../../../../components/modals'

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentTask: PropTypes.object,
};

export default function UserNewEditForm({ isEdit, currentTask }) {

  const navigate = useNavigate();

  const [errorOnEdit, setErrorOnEdit] = useState(false)
  const [successOnEdit, setSuccessOnEdit] = useState(false)
  const [errorOnEditDiscription, setErrorOnEditDiscription] = useState("Unknown error.")

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    id_name: Yup.string().required('ID_Name is required'),
    trigger_interval_weeks: Yup.number().required('Interval of weeks required'),
    trigger_interval_days: Yup.number().required('Interval of days required'),
    trigger_interval_hours: Yup.number().required('Interval of hours required'),
    trigger_interval_minutes: Yup.number().required('Interval of minutes required'),
    trigger_interval_seconds: Yup.number().required('Interval of seconds required'),
    task_app_name: Yup.string().required('APP NAME is required'),
    task_module_name: Yup.string().required('MODULE NAME is required'),
    task_function_name: Yup.string().required('FUNCTION NAME is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentTask?.name || '',
      id_name: currentTask?.id_name || '',
      trigger_interval_weeks:  currentTask?.trigger_interval_weeks || 0,
      trigger_interval_days:  currentTask?.trigger_interval_days || 0,
      trigger_interval_hours:  currentTask?.trigger_interval_hours || 0,
      trigger_interval_minutes:  currentTask?.trigger_interval_minutes || 0,
      trigger_interval_seconds:  currentTask?.trigger_interval_seconds || 0,
      task_app_name: currentTask?.task_app_name || '',
      task_module_name: currentTask?.task_module_name || '',
      task_function_name: currentTask?.task_function_name || '',
    }),
    [currentTask]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  
  const values = watch();

  /*
  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);
  */

  const onSubmit = async (data, event) => {
    
    let response = await TaskCreate(data);

    if (response.status == 500) {
      setErrorOnEdit(true);
      setErrorOnEditDiscription("Error. Status:500 [UNKNOWN ERROR]")  
    } else {
      let convertResponse = await response.json()

      if (response.status == 200) {
        setSuccessOnEdit(true);
      } else {
        setErrorOnEdit(true);
        setErrorOnEditDiscription("Error. Status:" + response.status.toString() + " [" + convertResponse.discription + "]")
      }
    }
  };

  return (
    <>
      <ModalErrorWindow
        open={errorOnEdit}
        setOpen={setErrorOnEdit}
        discription={errorOnEditDiscription}
      />
      
      <Modal
        open={successOnEdit}
      >
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
          <Typography variant="subtitle2">
            SUCCESS
          </Typography>
          <Button onClick={() => navigate(PATH_DASHBOARD.task.list)}>OK</Button>
        </Box>
      </Modal>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
                {isEdit && (
                  <Label
                    color={values.status !== 'active' ? 'error' : 'success'}
                    sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
                  >
                    {values.status}
                  </Label>
                )}
            </Card>

            <Card sx={{ p: 3 }}>
              <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value !== 'active'}
                          onChange={(event) => field.onChange(event.target.checked ? 'banned' : 'active')}
                        />
                      )}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Banned
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Apply disable account
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
                />

              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <RHFTextField name="name" label="Full Name"/>
                <RHFTextField name="id_name" label="ID Name"/>
                
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 2,
                  mt: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Stack spacing={2}>
                  <RHFTextField name="trigger_interval_weeks" label="trigger_interval_weeks" disabled={false}/>
                  <RHFTextField name="trigger_interval_days" label="trigger_interval_days" disabled={false}/>
                  <RHFTextField name="trigger_interval_hours" label="trigger_interval_hours" disabled={false}/>
                  <RHFTextField name="trigger_interval_minutes" label="trigger_interval_minutes" disabled={false}/>
                  <RHFTextField name="trigger_interval_seconds" label="trigger_interval_seconds" disabled={false}/>
                </Stack >
                
                <Stack spacing={2}>
                  <RHFTextField name="task_app_name" label="task_app_name" disabled={false}/>
                  <RHFTextField name="task_module_name" label="task_module_name" disabled={false}/>
                  <RHFTextField name="task_function_name" label="task_function_name" disabled={false}/>
                </Stack>
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                {/*<LoadingButton type="submit" variant="contained" loading={isSubmitting}>*/}
                <LoadingButton type="submit" variant="contained">
                  {!isEdit ? 'Create User' : 'Save Changess'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}