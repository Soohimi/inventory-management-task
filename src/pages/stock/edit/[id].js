import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  MenuItem,
  CircularProgress,
} from "@mui/material";

export default function EditStock() {
  const [stock, setStock] = useState({
    productId: "",
    warehouseId: "",
    quantity: "",
  });
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      Promise.all([
        fetch(`/api/stock/${id}`).then((res) => res.json()),
        fetch("/api/products").then((res) => res.json()),
        fetch("/api/warehouses").then((res) => res.json()),
      ]).then(([stockData, productsData, warehousesData]) => {
        setStock(stockData);
        setProducts(productsData);
        setWarehouses(warehousesData);
        setLoading(false);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/stock/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: parseInt(stock.productId),
        warehouseId: parseInt(stock.warehouseId),
        quantity: parseInt(stock.quantity),
      }),
    });
    if (res.ok) {
      router.push("/stock");
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

  // استایل برای پس‌زمینه منوی آبشاری (Paper)
  const menuProps = {
    PaperProps: {
      sx: {
        backgroundColor: "#1a1a1a",
      },
    },
  };

  // استایل برای آیتم‌های داخل منو (MenuItem)
  const menuItemStyles = {
    color: "#fff",
    backgroundColor: "#1a1a1a",
    // استایل برای حالت انتخاب شده
    "&.Mui-selected": {
      backgroundColor: "#1a1a1a !important",
      "&:hover": {
        backgroundColor: "#2a2a2a !important", // هاور در حالت انتخاب شده
      },
    },
    // استایل برای حالت هاور (اصلاح اصلی)
    "&:hover": {
      backgroundColor: "#2a2a2a !important", // رنگ کمی روشن‌تر برای هاور
    },
  };

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
          Edit Stock Record
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          {[
            {
              name: "productId",
              label: "Product",
              select: true,
              options: products,
            },
            {
              name: "warehouseId",
              label: "Warehouse",
              select: true,
              options: warehouses,
            },
            {
              name: "quantity",
              label: "Quantity",
              select: false,
              type: "number",
            },
          ].map((field) => (
            <TextField
              key={field.name}
              margin="normal"
              required
              fullWidth
              select={field.select}
              label={field.label}
              name={field.name}
              type={field.type || "text"}
              value={stock[field.name]}
              onChange={handleChange}
              SelectProps={field.select ? { MenuProps: menuProps } : undefined}
              inputProps={{
                style: { color: "#fff" },
                min: field.type === "number" ? 0 : undefined,
              }}
              sx={{
                mb: 2,
                "& .MuiInputLabel-root": { color: "#ccc" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#2a2a2a" },
                  "&:hover fieldset": { borderColor: "#4fc3f7" },
                  "&.Mui-focused fieldset": { borderColor: "#4fc3f7" },
                  "& input": { color: "#fff" },
                },
                "& .MuiSelect-select": { color: "#fff" },
              }}
            >
              {field.select &&
                field.options.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.id}
                    sx={menuItemStyles}
                  >
                    {field.name === "productId"
                      ? `${option.name} (${option.sku})`
                      : `${option.name} (${option.code})`}
                  </MenuItem>
                ))}
            </TextField>
          ))}

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
              Update Stock
            </Button>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              href="/stock"
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
