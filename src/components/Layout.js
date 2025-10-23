"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import InventoryIcon from "@mui/icons-material/Inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function Layout({ children }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { label: "Products", path: "/products", icon: <ShoppingCartIcon /> },
    { label: "Warehouses", path: "/warehouses", icon: <WarehouseIcon /> },
    { label: "Stock Levels", path: "/stock", icon: <InventoryIcon /> },
    { label: "Transfers", path: "/transfers", icon: <CompareArrowsIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: "100%" }}>
      <Toolbar />
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              href={item.path}
              selected={router.pathname === item.path}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "#2a2a2a",
                  color: "#fff",
                },
                "&:hover": {
                  backgroundColor: "#2a2a2a",
                  color: "#fff",
                },
                color: "#ccc",
              }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: router.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#0f0f0f",
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{ fontWeight: 500, color: "#fff" }}
          >
            Inventory System
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
            backgroundColor: "#1a1a1a",
            borderRight: "1px solid #2a2a2a",
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="nav"
        sx={{
          width: { md: 240 },
          flexShrink: { md: 0 },
          display: { xs: "none", md: "block" },
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
              backgroundColor: "#1a1a1a",
              borderRight: "1px solid #2a2a2a",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, md: 2 },
          mt: "64px",
          backgroundColor: "#0f0f0f",
          minHeight: "100vh",
          width: { xs: "100%", md: `calc(100% - 240px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
