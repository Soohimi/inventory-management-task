# Inventory Management System

A responsive web application built with Next.js and Material UI (MUI) for managing product inventory, warehouse locations, and stock levels.

## Status Summary

| Section        | Status                                                       |
| :------------- | :----------------------------------------------------------- |
| **Code Base**  | Stable (with recent dependency and responsiveness fixes)     |
| **Backend**    | Relies on API endpoints (No dedicated local backend or auth) |
| **Unit Tests** | Environment configured, but tests not yet fully implemented  |

---

## ✨ Features Completed

- **Responsive Dashboard Layout:** Built using **Material UI** and **Next.js** for full compatibility across all screen sizes (desktop, tablet, and mobile).
- **Persistent Navigation:** Features a fully functional Sidebar Navigation with active state highlighting and a mobile-friendly Drawer Menu.
- **Core Pages:** Implemented comprehensive pages for managing:
  - **Products:** Listing, adding, and editing product data.
  - **Warehouses:** Managing warehouse details.
  - **Stock Levels:** Viewing, filtering, and updating product stock quantities.
  - **Transfers:** Managing item movements between warehouses.
- **Data Export:** Functionality to **Export data to CSV** on the Stock and Warehouse pages.
- **Modular Architecture:** Used a reusable and modular component structure (e.g., `Layout`, `Sidebar`) for maintainability and scalability.
- **Design System:** Clean, consistent design system using a unified dark color palette based on Material UI.

---

## 🧠 Key Technical Decisions

- **Framework:** Used **Next.js** for robust routing, page management, and server-side capabilities.
- **UI Library:** Used **Material UI (MUI)** for consistent UI components, theming, and responsive design utilities.
- **Architecture:** Implemented a reusable `Layout` component to ensure consistent navigation and styling across all pages.
- **Data Handling:** Employed the native **Fetch API** for all CRUD (Create, Read, Update, Delete) operations against mock API endpoints.
- **Responsive Fixes (Critical):**
  - Implemented responsive controls (buttons and filters) that stack vertically on mobile screens using MUI's `sx` props and breakpoints (`flexDirection: { xs: 'column', sm: 'row' }`).
  - Ensured data tables are responsive by wrapping them in **`TableContainer`** with **`overflowX: 'auto'`** and setting a **`minWidth`** on the **`Table`** component, allowing for horizontal scrolling on mobile devices without breaking the layout.
- **Testing Setup:** Configured Jest and JSDOM with necessary workarounds (`IS_REACT_ACT_ENVIRONMENT = false;`) to resolve core environment conflicts related to React 18 and JSDOM for future unit test implementation.

---

## ⚠️ Known Limitations

- **Authentication:** No backend authentication or authorization is currently implemented.
- **Error Handling:** API error handling and input validation logic can be expanded further for a production environment.
- **Data Persistence:** Data persistence relies solely on the configured API endpoints (no local storage or dedicated database).
- **Unit Tests:** No unit/integration tests are fully implemented yet.

---

## 🧪 Testing Instructions

1.  Run the local development server:

    ```bash
    npm run dev
    ```

2.  Open the application at `http://localhost:3000`.
3.  **Navigate:** Test navigation between all core pages: `/products`, `/warehouses`, `/stock`, and `/transfers`.
4.  **CRUD Operations:** Try adding, editing, and deleting records on the Products, Warehouses, and Stock pages.
5.  **Responsiveness (Crucial Test):**
    - Verify the navigation drawer opens correctly on mobile screen sizes.
    - Shrink the browser window and check the **Stock Levels** and **Warehouses** pages: the table should display a **horizontal scrollbar** (not break the layout), and the filter/action buttons should **stack vertically**.
6.  **Data Export:** Click the "Export CSV" button to confirm data downloads successfully.

---

## 📦 Key Dependencies

- `@mui/material`
- `@mui/icons-material`
- `@emotion/react`
- `@emotion/styled`
- `next`
- `react` / `react-dom` (v18.2.0 recommended for stability)
- `jest`
- `@testing-library/react`

---

## 🎥 Video Walkthrough

🔗 Click here to view the walkthrough video
https://drive.google.com/file/d/1CWHXFw2kEyC2TVgkPjbYZmyKDYvXQU1f/view?usp=sharing
