import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";

export default function EditProduct() {
  const [product, setProduct] = useState({
    sku: "",
    name: "",
    category: "",
    unitCost: "",
    reorderPoint: "",
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...product,
        unitCost: parseFloat(product.unitCost),
        reorderPoint: parseInt(product.reorderPoint),
      }),
    });
    if (res.ok) {
      router.push("/products");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress sx={{ color: "#4fc3f7" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "sm", mx: "auto", mt: 4, mb: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          backgroundColor: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "#fff", mb: 3 }}
        >
          Edit Product
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          {["sku", "name", "category", "unitCost", "reorderPoint"].map(
            (field) => (
              <TextField
                key={field}
                margin="normal"
                required
                fullWidth
                label={
                  field === "sku"
                    ? "SKU"
                    : field === "name"
                    ? "Product Name"
                    : field === "category"
                    ? "Category"
                    : field === "unitCost"
                    ? "Unit Cost"
                    : "Reorder Point"
                }
                name={field}
                type={
                  field === "unitCost" || field === "reorderPoint"
                    ? "number"
                    : "text"
                }
                inputProps={{
                  step: field === "unitCost" ? "0.01" : "1",
                  min: "0",
                }}
                value={product[field]}
                onChange={handleChange}
                sx={{
                  input: { color: "#fff" },
                  label: { color: "#ccc" },
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#2a2a2a" },
                    "&:hover fieldset": { borderColor: "#4fc3f7" },
                    "&.Mui-focused fieldset": { borderColor: "#4fc3f7" },
                  },
                }}
              />
            )
          )}

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#4fc3f7",
                color: "#000",
                ":hover": { backgroundColor: "#36b0e0" },
              }}
            >
              Update Product
            </Button>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              href="/products"
              sx={{
                color: "#fff",
                borderColor: "#2a2a2a",
                ":hover": { borderColor: "#4fc3f7" },
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
