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

export default function EditWarehouse() {
  const [warehouse, setWarehouse] = useState({
    name: "",
    location: "",
    code: "",
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/warehouses/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setWarehouse(data);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setWarehouse({ ...warehouse, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/warehouses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(warehouse),
    });
    if (res.ok) {
      router.push("/warehouses");
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
          Edit Warehouse
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          {["code", "name", "location"].map((field) => (
            <TextField
              key={field}
              margin="normal"
              required
              fullWidth
              label={
                field === "code"
                  ? "Warehouse Code"
                  : field === "name"
                  ? "Warehouse Name"
                  : "Location"
              }
              name={field}
              type="text"
              value={warehouse[field]}
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
              Update Warehouse
            </Button>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              href="/warehouses"
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
