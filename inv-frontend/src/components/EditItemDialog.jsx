import React, { useState } from 'react';
import api from '../utils/axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControlLabel,
  Switch,
} from '@mui/material';

const EditItemDialog = ({ open, onClose, onSave, item, productTypeId }) => {
  const [isSold, setIsSold] = useState(item?.is_sold || false);

  const handleSubmit = async () => {
    try {
      await api.put(`/items/${item.id}`, {
        is_sold: isSold,
        product_type_id: productTypeId
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Item Status</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isSold}
                onChange={(e) => setIsSold(e.target.checked)}
                color="primary"
              />
            }
            label="Item is sold"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditItemDialog; 