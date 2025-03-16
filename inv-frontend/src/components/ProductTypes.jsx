import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import AddProductTypeDialog from './AddProductTypeDialog';
import EditProductTypeDialog from './EditProductTypeDialog';

const ProductTypes = () => {
  const [productTypes, setProductTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProductTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/product-types');
      const data = response.data.data || [];
      setProductTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      setProductTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProductTypes = productTypes.filter((type) =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    try {
      await api.delete(`/product-types/${id}`);
      fetchProductTypes();
    } catch (error) {
      // Handle error silently
    }
  };

  const handleEdit = (productType, event) => {
    event.stopPropagation();
    setSelectedProductType(productType);
    setOpenEditDialog(true);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Product Types
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Product Type
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        label="Search Product Types"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Product Type Name</TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProductTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No product types found
                </TableCell>
              </TableRow>
            ) : (
              filteredProductTypes.map((type) => (
                <TableRow
                  key={type.id}
                  hover
                  sx={{ cursor: 'default' }}
                >
                  <TableCell>{type.id}</TableCell>
                  <TableCell>
                    <img
                      src={type.image_url || 'https://via.placeholder.com/50'}
                      alt={type.name}
                      style={{ width: 50, height: 50, objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50';
                      }}
                    />
                  </TableCell>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.count}</TableCell>
                  <TableCell>
                    <Tooltip title="View Items">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product-types/${type.id}/items`);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={(e) => handleEdit(type, e)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(e) => handleDelete(type.id, e)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddProductTypeDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={fetchProductTypes}
      />

      <EditProductTypeDialog
        open={openEditDialog}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedProductType(null);
        }}
        onSave={fetchProductTypes}
        productType={selectedProductType}
      />
    </Container>
  );
};

export default ProductTypes; 