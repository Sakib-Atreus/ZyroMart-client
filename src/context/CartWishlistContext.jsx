import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { cartApi, wishlistApi } from "../api/endpoints";
import { useAuth } from "./AuthContext";

const CartWishlistContext = createContext({
  cartCount: 0,
  wishlistCount: 0,
  refreshCart: () => {},
  refreshWishlist: () => {},
  syncCartCount: () => {},
  syncWishlistCount: () => {},
});

export const CartWishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const refreshCart = useCallback(async () => {
    if (!user) { setCartCount(0); return; }
    try {
      const res = await cartApi.get();
      const data = res.data ?? {};
      setCartCount(data.itemCount ?? data.items?.length ?? 0);
    } catch {
      setCartCount(0);
    }
  }, [user]);

  const refreshWishlist = useCallback(async () => {
    if (!user) { setWishlistCount(0); return; }
    try {
      const res = await wishlistApi.get();
      setWishlistCount(res.data?.products?.length ?? 0);
    } catch {
      setWishlistCount(0);
    }
  }, [user]);

  const syncCartCount = useCallback((n) => setCartCount(n ?? 0), []);
  const syncWishlistCount = useCallback((n) => setWishlistCount(n ?? 0), []);

  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, [refreshCart, refreshWishlist]);

  return (
    <CartWishlistContext.Provider
      value={{ cartCount, wishlistCount, refreshCart, refreshWishlist, syncCartCount, syncWishlistCount }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => useContext(CartWishlistContext);
