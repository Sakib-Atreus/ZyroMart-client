import api from "./axios";

const unwrap = (promise) => promise.then((r) => r.data);

export const authApi = {
  login: (body) => unwrap(api.post("/auth/login", body)),
  signup: (body) => unwrap(api.post("/auth/signup", body)),
  logout: () => unwrap(api.post("/auth/logout")),
  changePassword: (body) => unwrap(api.post("/auth/change-password", body)),
};

export const userApi = {
  getMe: () => unwrap(api.get("/users/me")),
  updateMe: (body) => unwrap(api.patch("/users/me", body)),
  adminList: (params) => unwrap(api.get("/users/admin/list", { params })),
};

export const categoryApi = {
  list: () => unwrap(api.get("/categories")),
  get: (slug) => unwrap(api.get(`/categories/${slug}`)),
  create: (body) => unwrap(api.post("/categories", body)),
  update: (id, body) => unwrap(api.patch(`/categories/${id}`, body)),
  remove: (id) => unwrap(api.delete(`/categories/${id}`)),
};

export const vendorApi = {
  list: (params) => unwrap(api.get("/vendors", { params })),
  apply: (body) => unwrap(api.post("/vendors/apply", body)),
  me: () => unwrap(api.get("/vendors/me")),
  updateMe: (body) => unwrap(api.patch("/vendors/me", body)),
  changeStatus: (id, body) => unwrap(api.patch(`/vendors/${id}/status`, body)),
  adminList: (params) => unwrap(api.get("/vendors/admin/list", { params })),
  adminCreate: (body) => unwrap(api.post("/vendors/admin/create", body)),
};

export const productApi = {
  list: (params) => unwrap(api.get("/products", { params })),
  getBySlug: (slug) => unwrap(api.get(`/products/${slug}`)),
  create: (body) => unwrap(api.post("/products", body)),
  update: (id, body) => unwrap(api.patch(`/products/${id}`, body)),
  remove: (id) => unwrap(api.delete(`/products/${id}`)),
  changeStatus: (id, body) => unwrap(api.patch(`/products/${id}/status`, body)),
  vendorMe: (params) => unwrap(api.get("/products/vendor/me", { params })),
  newArrivals: (limit) => unwrap(api.get("/products/featured/new-arrivals", { params: { limit } })),
  topSelling: (limit) => unwrap(api.get("/products/featured/top-selling", { params: { limit } })),
  onlineExclusive: (limit) => unwrap(api.get("/products/featured/online-exclusive", { params: { limit } })),
  similar: (id, limit) => unwrap(api.get(`/products/similar/${id}`, { params: { limit } })),
};

export const variantApi = {
  byProduct: (productId) => unwrap(api.get(`/variants/product/${productId}`)),
  create: (body) => unwrap(api.post("/variants", body)),
  bulk: (body) => unwrap(api.post("/variants/bulk", body)),
  update: (id, body) => unwrap(api.patch(`/variants/${id}`, body)),
  remove: (id) => unwrap(api.delete(`/variants/${id}`)),
};

export const orderApi = {
  listAll: (params) => unwrap(api.get("/orders", { params })),
  listMine: (params) => unwrap(api.get("/orders/me", { params })),
  vendorMine: (params) => unwrap(api.get("/orders/vendor/me", { params })),
  get: (id) => unwrap(api.get(`/orders/${id}`)),
  create: (body) => unwrap(api.post("/orders", body)),
  cancel: (id, body) => unwrap(api.patch(`/orders/${id}/cancel`, body)),
  updateStatus: (id, body) => unwrap(api.patch(`/orders/${id}/status`, body)),
};

export const cartApi = {
  get: () => unwrap(api.get("/cart")),
  addItem: (body) => unwrap(api.post("/cart/items", body)),
  updateItem: (variantId, body) => unwrap(api.patch(`/cart/items/${variantId}`, body)),
  removeItem: (variantId) => unwrap(api.delete(`/cart/items/${variantId}`)),
  clear: () => unwrap(api.delete("/cart")),
};

export const paymentApi = {
  createCheckoutSession: (body) => unwrap(api.post("/payments/checkout-session", body)),
};

export const wishlistApi = {
  get: () => unwrap(api.get("/wishlist")),
  add: (productId) => unwrap(api.post("/wishlist/items", { product: productId })),
  remove: (productId) => unwrap(api.delete(`/wishlist/items/${productId}`)),
  clear: () => unwrap(api.delete("/wishlist")),
};

export const reviewApi = {
  listByProduct: (productId, params) =>
    unwrap(api.get(`/reviews/product/${productId}`, { params })),
  myReviewForProduct: (productId) =>
    unwrap(api.get(`/reviews/product/${productId}/me`)),
  create: (body) => unwrap(api.post("/reviews", body)),
  update: (id, body) => unwrap(api.patch(`/reviews/${id}`, body)),
  remove: (id) => unwrap(api.delete(`/reviews/${id}`)),
};

export const questionApi = {
  listByProduct: (productId, params) =>
    unwrap(api.get(`/questions/product/${productId}`, { params })),
  create: (body) => unwrap(api.post("/questions", body)),
  answer: (id, body) => unwrap(api.post(`/questions/${id}/answer`, body)),
  remove: (id) => unwrap(api.delete(`/questions/${id}`)),
};

export const analyticsApi = {
  platform: () => unwrap(api.get("/analytics/platform")),
  vendor: () => unwrap(api.get("/analytics/vendor")),
};

export const userDashboardApi = {
  get: () => unwrap(api.get("/users/dashboard")),
};

export const chatApi = {
  // Vendor
  sendMessage: (body) => unwrap(api.post("/chat/messages", { body })),
  myConversation: () => unwrap(api.get("/chat/me")),
  // Admin
  listConversations: () => unwrap(api.get("/chat")),
  adminSend: (conversationId, body) =>
    unwrap(api.post(`/chat/${conversationId}/messages`, { body })),
  // Shared
  getMessages: (conversationId, params) =>
    unwrap(api.get(`/chat/${conversationId}/messages`, { params })),
};
