"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import GetAppIcon from "@mui/icons-material/GetApp";

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await fetch("/api/warehouses");
      const data = await res.json();
      setWarehouses(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const handleClickOpen = (id) => {
    setSelectedWarehouseId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedWarehouseId(null);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/warehouses/${selectedWarehouseId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setWarehouses((prev) =>
          prev.filter((w) => w.id !== selectedWarehouseId)
        );
        handleClose();
      }
    } catch (error) {
      console.error("Error deleting warehouse:", error);
    }
  };

  const handleExportCsv = () => {
    const warehouseDataForExport = warehouses.map((w) => ({
      Code: w.code,
      Name: w.name,
      Location: w.location,
    }));

    if (warehouseDataForExport.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = Object.keys(warehouseDataForExport[0]);
    const csvContent = [
      headers.join(","),
      ...warehouseDataForExport.map((row) =>
        headers
          .map((header) => {
            let value = row[header];
            if (typeof value === "string" && value.includes(",")) {
              return `"${value}"`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "warehouses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 500, color: "#fff" }}>
          Warehouses
        </Typography>

        {/* 💡 Container for buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<GetAppIcon />}
            onClick={handleExportCsv}
            sx={{
              color: "#4fc3f7",
              borderColor: "#4fc3f7",
              ":hover": {
                borderColor: "#4fc3f7",
                backgroundColor: "rgba(79, 195, 247, 0.08)",
              },
            }}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            href="/warehouses/add"
            sx={{
              backgroundColor: "#2a2a2a",
              color: "#fff",
              ":hover": { backgroundColor: "#3a3a3a" },
            }}
          >
            Add Warehouse
          </Button>
        </Box>
        {/* 💡 END Container for buttons */}
      </Box>

      {/* Table - remains the same */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "#1a1a1a",
          border: "1px solid #2a2a2a",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#2a2a2a" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Code
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Location
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouses.length > 0 ? (
              warehouses.map((warehouse) => (
                <TableRow
                  key={warehouse.id}
                  hover
                  sx={{
                    "&:hover": { backgroundColor: "#2a2a2a" },
                    backgroundColor: "#1a1a1a",
                  }}
                >
                  <TableCell sx={{ color: "#ccc" }}>{warehouse.code}</TableCell>
                  <TableCell sx={{ color: "#ccc" }}>{warehouse.name}</TableCell>
                  <TableCell sx={{ color: "#ccc" }}>
                    {warehouse.location}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      component={Link}
                      href={`/warehouses/edit/${warehouse.id}`}
                      size="small"
                      sx={{ color: "#4fc3f7" }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleClickOpen(warehouse.id)}
                      size="small"
                      sx={{ color: "#f44336" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{ py: 3, color: "#ccc" }}
                >
                  No warehouses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" },
        }}
      >
        <DialogTitle sx={{ color: "#fff" }}>Delete Warehouse</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#ccc" }}>
            Are you sure you want to delete this warehouse? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#ccc" }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} sx={{ color: "#f44336" }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
