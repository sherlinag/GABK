const CART_KEY = "g-arasu-cart";
const CART_EVENT = "g-arasu-cart-updated";

export function readCart() {
  try {
    const cart = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

export function writeCart(cart) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function subscribeToCart(onChange) {
  window.addEventListener(CART_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CART_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function cartEventName() {
  return CART_EVENT;
}
