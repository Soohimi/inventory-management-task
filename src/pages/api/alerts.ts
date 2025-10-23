import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from 'next';
import { AlertItem } from '@/types';

const alertsFilePath = path.join(process.cwd(), "data", "alerts.json");

function readAlerts(): AlertItem[] {
  const data = fs.readFileSync(alertsFilePath, "utf-8");
  return JSON.parse(data || "[]");
}

function writeAlerts(data: AlertItem[]): void {
  fs.writeFileSync(alertsFilePath, JSON.stringify(data, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const alerts = readAlerts();
      return res.status(200).json(alerts);
    }

    if (req.method === "POST") {
      const { productId, status, message } = req.body;

      if (!productId || !status || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const alerts = readAlerts();
      const newAlert: AlertItem = {
        id: Date.now(),
        productId,
        status,
        message,
        date: new Date().toISOString(),
        resolved: false,
      };

      alerts.push(newAlert);
      writeAlerts(alerts);

      return res.status(201).json(newAlert);
    }

    if (req.method === "PATCH") {
      const { id, resolved } = req.body;
      const alerts = readAlerts();

      const index = alerts.findIndex((a) => a.id === id);
      if (index === -1) {
        return res.status(404).json({ error: "Alert not found" });
      }

      alerts[index].resolved = resolved;
      writeAlerts(alerts);

      return res.status(200).json(alerts[index]);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
