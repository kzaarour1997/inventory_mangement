import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Breadcrumbs,
  Link,
  Checkbox,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import AddItemDialog from './AddItemDialog';

const ProductTypeItems = () => {
  const { productTypeId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [productType, setProductType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchProductType = useCallback(async () => {
    try {
      const response = await api.get(`/product-types/${productTypeId}`);
      setProductType(response.data.data);
    } catch (error) {
      console.error('Error fetching product type:', error);
    }
  }, [productTypeId]);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/items', {
        params: {
          product_type_id: productTypeId
        }
      });
      setItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [productTypeId]);

  useEffect(() => {
    fetchProductType();
    fetchItems();
  }, [fetchProductType, fetchItems]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = async (item) => {
    try {
      await api.put(`/items/${item.id}`, {
        is_sold: !item.is_sold,
        serial_number: item.serial_number,
        product_type_id: productTypeId
      });
      fetchItems();
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const filteredItems = items.filter((item) =>
    item.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/product-types')}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <ArrowBackIcon sx={{ mr: 0.5 }} fontSize="small" />
            Product Types
          </Link>
          <Typography color="text.primary">
            {productType?.name || 'Items'}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Items - {productType?.name}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
        >
          Add Item
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        label="Search by Serial Number"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Serial Number</TableCell>
              <TableCell align="center">Sold</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.serial_number}</TableCell>
                  <TableCell align="center">
                    <Tooltip title={item.is_sold ? "Mark as Available" : "Mark as Sold"}>
                      <Checkbox
                        checked={item.is_sold}
                        onChange={() => handleStatusChange(item)}
                        color="primary"
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={async () => {
                        try {
                          await api.delete(`/items/${item.id}`);
                          fetchItems();
                        } catch (error) {
                          console.error('Error deleting item:', error);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddItemDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSave={fetchItems}
        productTypeId={productTypeId}
      />
    </Container>
  );
};

export default ProductTypeItems; 