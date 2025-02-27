import { MenuItem, InsertMenuItem, Order, InsertOrder, OrderItem, InsertOrderItem } from "@shared/schema";

export interface IStorage {
  // Menu Items
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  
  // Orders
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private menuItemId: number = 1;
  private orderId: number = 1;
  private orderItemId: number = 1;

  constructor() {
    this.menuItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    // Add sample menu items
    const sampleItems: InsertMenuItem[] = [
      {
        name: "Classic Burger",
        description: "Juicy beef patty with fresh vegetables",
        price: 12.99,
        imageUrl: "https://images.unsplash.com/photo-1563897539633-7374c276c212",
        category: "Main",
        available: true,
      },
      {
        name: "Caesar Salad",
        description: "Crispy romaine lettuce with parmesan",
        price: 8.99,
        imageUrl: "https://images.unsplash.com/photo-1564844536311-de546a28c87d",
        category: "Starters",
        available: true,
      },
      {
        name: "Grilled Salmon",
        description: "Fresh salmon with lemon butter sauce",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1432139555190-58524dae6a55",
        category: "Main",
        available: true,
      }
    ];

    sampleItems.forEach(item => this.createMenuItem(item));
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const newItem: MenuItem = { ...item, id: this.menuItemId++ };
    this.menuItems.set(newItem.id, newItem);
    return newItem;
  }

  async updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const existingItem = this.menuItems.get(id);
    if (!existingItem) return undefined;
    
    const updatedItem = { ...existingItem, ...item };
    this.menuItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: this.orderId++,
      createdAt: new Date(),
    };
    this.orders.set(newOrder.id, newOrder);

    items.forEach(item => {
      const newOrderItem: OrderItem = {
        ...item,
        id: this.orderItemId++,
        orderId: newOrder.id,
      };
      this.orderItems.set(newOrderItem.id, newOrderItem);
    });

    return newOrder;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      item => item.orderId === orderId
    );
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}

export const storage = new MemStorage();
