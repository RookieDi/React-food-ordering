import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMenuItemSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Menu Items
  app.get("/api/menu", async (_req, res) => {
    const items = await storage.getAllMenuItems();
    res.json(items);
  });

  app.post("/api/menu", async (req, res) => {
    try {
      const item = insertMenuItemSchema.parse(req.body);
      const newItem = await storage.createMenuItem(item);
      res.json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid menu item data" });
        return;
      }
      throw error;
    }
  });

  app.patch("/api/menu/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const updates = insertMenuItemSchema.partial().parse(req.body);
      const updated = await storage.updateMenuItem(id, updates);
      if (!updated) {
        res.status(404).json({ message: "Menu item not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid menu item data" });
        return;
      }
      throw error;
    }
  });

  app.delete("/api/menu/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteMenuItem(id);
    if (!deleted) {
      res.status(404).json({ message: "Menu item not found" });
      return;
    }
    res.status(204).end();
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const orderSchema = z.object({
        order: insertOrderSchema,
        items: z.array(insertOrderItemSchema),
      });
      
      const { order, items } = orderSchema.parse(req.body);
      const newOrder = await storage.createOrder(order, items);
      res.json(newOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid order data" });
        return;
      }
      throw error;
    }
  });

  app.get("/api/orders", async (_req, res) => {
    const orders = await storage.getAllOrders();
    res.json(orders);
  });

  app.get("/api/orders/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const order = await storage.getOrder(id);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    const items = await storage.getOrderItems(id);
    res.json({ order, items });
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    const id = parseInt(req.params.id);
    const statusSchema = z.object({ status: z.string() });
    try {
      const { status } = statusSchema.parse(req.body);
      const updated = await storage.updateOrderStatus(id, status);
      if (!updated) {
        res.status(404).json({ message: "Order not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid status" });
        return;
      }
      throw error;
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
