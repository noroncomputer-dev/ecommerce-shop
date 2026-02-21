"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../services/productService";
import orderService, { Order, ShippingAddress } from "../services/orderService";
import { useAuth } from "./AuthContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  checkout: (
    shippingAddress: ShippingAddress,
    paymentMethod: string,
  ) => Promise<Order>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { isAuthenticated } = useAuth();

  // لود سبد خرید از localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // ✅ حتماً چک می‌کنیم آرایه باشه
        setItems(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error("Error loading cart:", error);
        setItems([]); // ✅ اگه خطا داد، آرایه خالی
        localStorage.removeItem("cart"); // ✅ داده خراب رو پاک کن
      }
    }
  }, []);

  // ذخیره سبد خرید در localStorage
  useEffect(() => {
    if (Array.isArray(items)) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items]);

  const addToCart = (product: Product, quantity: number) => {
    setItems((prev) => {
      // ✅ اطمینان از اینکه prev آرایه است
      const safeItems = Array.isArray(prev) ? prev : [];

      const existingItem = safeItems.find(
        (item) => item.product._id === product._id,
      );

      if (existingItem) {
        return safeItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        return [...safeItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => {
      const safeItems = Array.isArray(prev) ? prev : [];
      return safeItems.filter((item) => item.product._id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) => {
      const safeItems = Array.isArray(prev) ? prev : [];
      return safeItems.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item,
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const checkout = async (
    shippingAddress: ShippingAddress,
    paymentMethod: string,
  ): Promise<Order> => {
    const safeItems = Array.isArray(items) ? items : [];

    if (safeItems.length === 0) {
      throw new Error("سبد خرید خالی است");
    }

    const orderData = {
      items: safeItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      })),
      shippingAddress,
      paymentMethod,
    };

    const order = await orderService.createOrder(orderData);

    if (!order || !order._id) {
      throw new Error("خطا در ثبت سفارش — اطلاعات سفارش ناقص است");
    }

    clearCart();

    return order;
  };

  const totalItems = Array.isArray(items)
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const totalPrice = Array.isArray(items)
    ? items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        checkout,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
