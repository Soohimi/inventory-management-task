import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from 'next';
import { Product, StockItem, AlertItem } from '@/types';

const productsPath = path.join(process.cwd(), "data", "products.json");
const stockPath = path.join(process.cwd(), "data", "stock.json");
const alertsPath = path.join(process.cwd(), "data", "alerts.json");

const readJson = <T>(filePath: string): T => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const writeJson = <T>(filePath: string, data: T): void =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const products = readJson<Product[]>(productsPath);
    const stock = readJson<StockItem[]>(stockPath);
    let alerts = readJson<AlertItem[]>(alertsPath);

    alerts = alerts.filter((a) => a.resolved);

    const newAlerts: AlertItem[] = [];

    products.forEach((product) => {
      const productStock = stock.filter((s) => s.productId === product.id);
      const totalStock = productStock.reduce((sum, s) => sum + s.quantity, 0);
      const reorderPoint = product.reorderPoint || 10;

      if (totalStock < reorderPoint) {
        const status = totalStock === 0 ? "critical" : "low";
        const alert: AlertItem = {
          id: Date.now() + Math.random(),
          productId: product.id,
          productName: product.name,
          status,
          message: `Total stock for ${product.name} is low (${totalStock} units left).`,
          date: new Date().toISOString(),
          resolved: false,
        };
        newAlerts.push(alert);
        alerts.push(alert);
      }

      productStock.forEach((s) => {
        if (s.quantity < reorderPoint) {
          const status = s.quantity === 0 ? "critical" : "low";
          const alert: AlertItem = {
            id: Date.now() + Math.random(),
            productId: product.id,
            productName: product.name,
            status,
            message: `Stock for ${product.name} in warehouse ${s.warehouseId} is low (${s.quantity} units left).`,
            date: new Date().toISOString(),
            resolved: false,
          };
          newAlerts.push(alert);
          alerts.push(alert);
        }
      });
    });

    writeJson(alertsPath, alerts);

    return res.status(200).json({
      message:
        newAlerts.length > 0
          ? `${newAlerts.length} new alerts generated`
          : "No new low stock alerts",
      newAlerts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
