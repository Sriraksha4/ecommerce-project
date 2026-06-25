/**
 * Resolves a dynamic, category-aware placeholder image for products
 * that do not have an image assigned in the database.
 * 
 * @param {Object} product - The product object containing name and category
 * @returns {string} - Unsplash image URL
 */
export const getProductImage = (product) => {
  const name = (product?.name || "").toLowerCase();
  const category = (product?.category || "").toLowerCase();

  const hasValidImage = product && product.image && 
    product.image !== "undefined" && 
    product.image !== "null" && 
    product.image !== "";

  // If there's an image, but it's the default watch image AND this product is NOT a watch (e.g. it is a laptop/phone), we override it.
  const isDefaultWatchImage = hasValidImage && product.image.includes("photo-1523275335684-37898b6baf30");
  const isWatch = name.includes("watch") || name.includes("clock") || category.includes("watch");

  if (hasValidImage && !(isDefaultWatchImage && !isWatch)) {
    return product.image;
  }

  // 1. Laptops / Computers
  if (
    name.includes("laptop") || 
    name.includes("macbook") || 
    name.includes("computer") || 
    name.includes("desktop") ||
    name.includes("dell") || 
    name.includes("hp") || 
    name.includes("lenovo") || 
    name.includes("thinkpad") || 
    name.includes("pavilion") || 
    name.includes("inspiron") ||
    name.includes("vostro") ||
    name.includes("chromebook") ||
    name.includes("notebook") ||
    category.includes("laptop") || 
    category.includes("computer") ||
    category.includes("desktop")
  ) {
    return "https://images.unsplash.com/photo-1496181130207-897410caca88?w=500&q=80";
  }

  // 2. Phones / Mobile Devices
  if (
    name.includes("phone") || 
    name.includes("iphone") || 
    name.includes("mobile") || 
    name.includes("smartphone") ||
    category.includes("phone") || 
    category.includes("mobile")
  ) {
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80";
  }

  // 3. Audio / Headphones
  if (
    name.includes("headphone") || 
    name.includes("earbud") || 
    name.includes("audio") || 
    name.includes("speaker") || 
    category.includes("audio")
  ) {
    return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80";
  }

  // 4. Watches / Smartwatches
  if (
    name.includes("watch") || 
    name.includes("clock") || 
    category.includes("watch")
  ) {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80";
  }

  // 5. Clothing / Fashion / Apparel
  if (
    category.includes("clothing") || 
    category.includes("fashion") || 
    category.includes("apparel") || 
    name.includes("shirt") || 
    name.includes("t-shirt") || 
    name.includes("pants") ||
    name.includes("shoe") ||
    name.includes("jacket")
  ) {
    return "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80";
  }

  // 6. Books
  if (
    category.includes("book") || 
    name.includes("book") || 
    name.includes("novel") ||
    name.includes("textbook")
  ) {
    return "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80";
  }

  // 7. Home & Furniture
  if (
    category.includes("home") || 
    category.includes("furniture") || 
    name.includes("chair") || 
    name.includes("table") || 
    name.includes("desk") ||
    name.includes("couch") ||
    name.includes("furniture")
  ) {
    return "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80";
  }

  // 8. General fallback for other categories/products
  return "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80";
};
