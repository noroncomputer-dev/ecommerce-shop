import api from "./api";

// ✅ از environment variable استفاده میکنه — نه localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
}

class OrderServiceFetch {
  private getHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async createOrder(data: any): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP error ${response.status}`);
    }
    return response.json();
  }

  async getMyOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return response.json();
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return response.json();
  }

  async getAllOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders/all`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return response.json();
  }

  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return response.json();
  }
}

export default new OrderServiceFetch();