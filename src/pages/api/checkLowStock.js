import fs from "fs";
import path from "path";

const productsPath = path.join(process.cwd(), "data", "products.json");
const stockPath = path.join(process.cwd(), "data", "stock.json");
const alertsPath = path.join(process.cwd(), "data", "alerts.json");

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const writeJson = (filePath, data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const products = readJson(productsPath);
    const stock = readJson(stockPath);
    let alerts = readJson(alertsPath);

    alerts = alerts.filter((a) => a.resolved);

    const newAlerts = [];

    products.forEach((product) => {
      const productStock = stock.filter((s) => s.productId === product.id);
      const totalStock = productStock.reduce((sum, s) => sum + s.quantity, 0);
      const reorderPoint = product.reorderPoint || 10;

      if (totalStock < reorderPoint) {
        const status = totalStock === 0 ? "critical" : "low";
        const alert = {
          id: Date.now() + Math.random(),
          type: "total",
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
          const alert = {
            id: Date.now() + Math.random(),
            type: "warehouse",
            productId: product.id,
            productName: product.name,
            warehouseId: s.warehouseId,
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
