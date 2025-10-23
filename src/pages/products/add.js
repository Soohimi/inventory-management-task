import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from '@mui/material';

export default function AddProduct() {
  const [product, setProduct] = useState({
    sku: '',
    name: '',
    category: '',
    unitCost: '',
    reorderPoint: '',
  });

  const router = useRouter();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...product,
        unitCost: parseFloat(product.unitCost),
        reorderPoint: parseInt(product.reorderPoint),
      }),
    });
    if (res.ok) {
      router.push('/products');
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
            Add New Product
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="SKU"
              name="sku"
              value={product.sku}
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
            <TextField
              margin="normal"
              required
              fullWidth
              label="Product Name"
              name="name"
              value={product.name}
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
            <TextField
              margin="normal"
              required
              fullWidth
              label="Category"
              name="category"
              value={product.category}
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
            <TextField
              margin="normal"
              required
              fullWidth
              label="Unit Cost"
              name="unitCost"
              type="number"
              inputProps={{ step: '0.01', min: '0' }}
              value={product.unitCost}
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
            <TextField
              margin="normal"
              required
              fullWidth
              label="Reorder Point"
              name="reorderPoint"
              type="number"
              inputProps={{ min: '0' }}
              value={product.reorderPoint}
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
                Add Product
              </Button>
              <Button
                fullWidth
                variant="outlined"
                component={Link}
                href="/products"
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

