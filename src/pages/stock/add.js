import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  MenuItem,
} from '@mui/material';

export default function AddStock() {
  const [stock, setStock] = useState({
    productId: '',
    warehouseId: '',
    quantity: '',
  });
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch('/api/warehouses').then(res => res.json()),
    ]).then(([productsData, warehousesData]) => {
      setProducts(productsData);
      setWarehouses(warehousesData);
    });
  }, []);

  const handleChange = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: parseInt(stock.productId),
        warehouseId: parseInt(stock.warehouseId),
        quantity: parseInt(stock.quantity),
      }),
    });
    if (res.ok) {
      router.push('/stock');
    }
  };

  return (
    <Box sx={{ maxWidth: "sm", mx: "auto" }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4,
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: "#fff", mb: 3 }}>
            Add Stock Record
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Product"
              name="productId"
              value={stock.productId}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: '#2a2a2a',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4fc3f7',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4fc3f7',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#ccc',
                  '&.Mui-focused': {
                    color: '#4fc3f7',
                  },
                },
              }}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              select
              label="Warehouse"
              name="warehouseId"
              value={stock.warehouseId}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: '#2a2a2a',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4fc3f7',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4fc3f7',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#ccc',
                  '&.Mui-focused': {
                    color: '#4fc3f7',
                  },
                },
              }}
            >
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name} ({warehouse.code})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              inputProps={{ min: '0' }}
              value={stock.quantity}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: '#2a2a2a',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4fc3f7',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4fc3f7',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#ccc',
                  '&.Mui-focused': {
                    color: '#4fc3f7',
                  },
                },
              }}
            />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#2a2a2a",
                  color: "#fff",
                  ":hover": { backgroundColor: "#3a3a3a" },
                }}
              >
                Add Stock
              </Button>
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                href="/stock"
                sx={{
                  borderColor: "#2a2a2a",
                  color: "#ccc",
                  ":hover": { 
                    borderColor: "#4fc3f7",
                    color: "#4fc3f7",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
    </Box>
  );
}

