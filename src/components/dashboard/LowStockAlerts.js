"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Typography, Chip, Button } from "@mui/material";

export default function LowStockAlerts({ alerts }) {
  const containerRef = useRef(null);
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  useEffect(() => {
    const unresolved = alerts.filter((a) => !a.resolved);
    setVisibleAlerts(unresolved);
  }, [alerts]);

  const handleResolve = async (id) => {
    try {
      await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, resolved: true }),
      });
      setVisibleAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error resolving alert:", err);
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#fff" }}>
        Low Stock Alerts
      </Typography>

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {visibleAlerts.length === 0 && (
          <Typography sx={{ color: "#fff", textAlign: "center", mt: 2 }}>
            ✅ No low stock alerts
          </Typography>
        )}

        {visibleAlerts.map((alert) => (
        <Box
          key={alert.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            p: 1,
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: 1,
          }}
        >
          <Box>
            <Typography sx={{ color: "#fff", fontWeight: 500 }}>
              {alert.productName}
            </Typography>
            <Typography sx={{ color: "#ccc", fontSize: 12 }}>
              {alert.message}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={alert.status.toUpperCase()}
              color={
                alert.status === "critical"
                  ? "error"
                  : alert.status === "low"
                  ? "warning"
                  : "default"
              }
              size="small"
            />
            <Button
              variant="contained"
              size="small"
              onClick={() => handleResolve(alert.id)}
            >
              Resolve
            </Button>
          </Box>
         </Box>
       ))}
      </Box>
     </Box>
   );
 }
