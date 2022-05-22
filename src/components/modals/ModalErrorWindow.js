import { Button, Modal, Box, Typography, } from '@mui/material';
import PropTypes from 'prop-types';

export default function ModalErrorWindow({ open, setOpen, discription}) {

    return (
        <Modal 
          open={open}
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
              {discription}
            </Typography>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </Box>
        </Modal>
    )
  }