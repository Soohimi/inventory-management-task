import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from 'next';
import { Transfer, StockItem, Product, Warehouse } from '@/types';

const transfersFile = path.join(process.cwd(), "data", "transfers.json");
const stockFile = path.join(process.cwd(), "data", "stock.json");
const productsFile = path.join(process.cwd(), "data", "products.json");
const warehousesFile = path.join(process.cwd(), "data", "warehouses.json");

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function writeJson<T>(file: string, data: T): void {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const transfers = readJson<Transfer[]>(transfersFile);
    return res.status(200).json(transfers);
  }

  if (req.method === "POST") {
    let { productId, fromWarehouseId, toWarehouseId, quantity } = req.body;

    productId = Number(productId);
    fromWarehouseId = Number(fromWarehouseId);
    toWarehouseId = Number(toWarehouseId);
    quantity = Number(quantity);

    if (
      !productId ||
      !fromWarehouseId ||
      !toWarehouseId ||
      !Number.isFinite(quantity)
    ) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }
    if (quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }
    if (fromWarehouseId === toWarehouseId) {
      return res
        .status(400)
        .json({ message: "Source and destination must differ" });
    }

    const products = readJson<Product[]>(productsFile);
    const warehouses = readJson<Warehouse[]>(warehousesFile);
    if (!products.find((p) => p.id === productId)) {
      return res.status(400).json({ message: "Product not found" });
    }
    if (!warehouses.find((w) => w.id === fromWarehouseId)) {
      return res.status(400).json({ message: "Source warehouse not found" });
    }
    if (!warehouses.find((w) => w.id === toWarehouseId)) {
      return res
        .status(400)
        .json({ message: "Destination warehouse not found" });
    }

    const stockData = readJson<StockItem[]>(stockFile);

    const fromIndex = stockData.findIndex(
      (s) => s.productId === productId && s.warehouseId === fromWarehouseId
    );

    if (fromIndex === -1 || stockData[fromIndex].quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Insufficient stock in source warehouse" });
    }

    stockData[fromIndex].quantity -= quantity;

    const toIndex = stockData.findIndex(
      (s) => s.productId === productId && s.warehouseId === toWarehouseId
    );

    if (toIndex !== -1) {
      stockData[toIndex].quantity += quantity;
    } else {
      const nextId = stockData.length
        ? Math.max(...stockData.map((s) => s.id)) + 1
        : 1;
      stockData.push({
        id: nextId,
        productId,
        warehouseId: toWarehouseId,
        quantity,
      });
    }

    writeJson(stockFile, stockData);

    const transfers = readJson<Transfer[]>(transfersFile);
    const newId = transfers.length
      ? Math.max(...transfers.map((t) => t.id)) + 1
      : 1;
    const newTransfer: Transfer = {
      id: newId,
      productId,
      fromWarehouseId,
      toWarehouseId,
      quantity,
      date: new Date().toISOString(),
    };
    transfers.push(newTransfer);
    writeJson(transfersFile, transfers);

    return res.status(201).json(newTransfer);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
