import React, { useState } from 'react';
import api from '../utils/axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';

const AddItemDialog = ({ open, onClose, onSave, productTypeId }) => {
  const [serialNumbers, setSerialNumbers] = useState('');

  const handleSubmit = async () => {
    try {
      const serialNumbersArray = serialNumbers
        .split('\n')
        .map(sn => sn.trim())
        .filter(sn => sn !== '');

      if (serialNumbersArray.length === 0) {
        alert('Please enter at least one serial number');
        return;
      }

      await api.post('/items', {
        serial_numbers: serialNumbersArray,
        product_type_id: productTypeId
      });

      onSave();
      handleClose();
    } catch (error) {
      console.error('Error adding items:', error);
      alert('Error adding items. Please try again.');
    }
  };

  const handleClose = () => {
    setSerialNumbers('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Items</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Enter one serial number per line. You can add multiple items at once.
          </Typography>
          <TextField
            fullWidth
            label="Serial Numbers"
            value={serialNumbers}
            onChange={(e) => setSerialNumbers(e.target.value)}
            margin="normal"
            multiline
            rows={6}
            placeholder="Enter serial numbers here&#10;One per line"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog; 