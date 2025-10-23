export interface Product {
  reorderPoint: number;
  id: number;
  name: string;
}

export interface Warehouse {
  id: number;
  name: string;
}

export interface Transfer {
  id: number;
  productId: number;
  fromWarehouseId: number;
  toWarehouseId: number;
  quantity: number;
  date?: string;
}

export interface FormState {
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: string;
}

export interface MessageState {
  open: boolean;
  text: string;
  severity: "success" | "error" | "info" | "warning";
}

export interface Product {
  id: number;
  name: string;
}

export interface StockItem {
  id: number;
  productId: number;
  quantity: number;
}

export interface Warehouse {
  id: number;
  name: string;
}

export interface AlertItem {
  id: number | string;
  productId: number | string;
  productName: string;
  message: string;
  status: "low" | "critical" | "info";
  resolved: boolean;
}
