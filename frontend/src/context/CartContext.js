import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState({ code: "", discountPercent: 0 });

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error("Error parsing cart storage:", e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const addToCart = (product, quantity = 1) => {
    const existingIndex = cart.findIndex((item) => item.product._id === product._id);
    const newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, quantity });
    }
    saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.product._id !== productId);
    saveCart(newCart);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map((item) => {
      if (item.product._id === productId) {
        return { ...item, quantity: Number(quantity) };
      }
      return item;
    });
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
    setCoupon({ code: "", discountPercent: 0 });
  };

  const applyCoupon = (code) => {
    const cleanedCode = code.trim().toUpperCase();
    if (cleanedCode === "DISCOUNT10") {
      setCoupon({ code: cleanedCode, discountPercent: 10 });
      return { success: true, message: "10% Discount Coupon Applied!" };
    }
    if (cleanedCode === "AURA20") {
      setCoupon({ code: cleanedCode, discountPercent: 20 });
      return { success: true, message: "20% Promo Coupon Applied!" };
    }
    return { success: false, message: "Invalid coupon code." };
  };

  const removeCoupon = () => {
    setCoupon({ code: "", discountPercent: 0 });
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const discountAmount = Math.round(subtotal * (coupon.discountPercent / 100));
  const amountAfterDiscount = subtotal - discountAmount;
  
  const gstAmount = Math.round(amountAfterDiscount * 0.18);
  const shippingFee = subtotal > 1500 ? 0 : 150; // free above ₹1500
  const grandTotal = amountAfterDiscount + gstAmount + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal: subtotal, // preserve legacy name cartTotal for compatibility
        subtotal,
        coupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        gstAmount,
        shippingFee,
        grandTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
