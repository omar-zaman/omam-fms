import api from "./apiClient";

// Helper to transform MongoDB _id to id for frontend compatibility
function transformItem(item) {
  if (!item) return null;
  return {
    ...item,
    id: item._id || item.id,
    supplierId: item.supplierId?._id || item.supplierId,
    supplierName: item.supplierId?.name || item.supplierName,
  };
}

function transformList(items) {
  return items.map(transformItem);
}

// Items API
export async function fetchItems(search = "") {
  const params = search ? { search } : {};
  const items = await api.get("/items", params);
  return transformList(items);
}

export async function createItem(payload) {
  const item = await api.post("/items", payload);
  return transformItem(item);
}

export async function updateItem(id, payload) {
  const item = await api.put(`/items/${id}`, payload);
  return transformItem(item);
}

export async function deleteItem(id) {
  await api.delete(`/items/${id}`);
  return true;
}

export async function getItem(id) {
  const item = await api.get(`/items/${id}`);
  return transformItem(item);
}

// Materials API
export async function fetchMaterials(search = "") {
  const params = search ? { search } : {};
  const materials = await api.get("/materials", params);
  return transformList(materials);
}

export async function createMaterial(payload) {
  const material = await api.post("/materials", payload);
  return transformItem(material);
}

export async function updateMaterial(id, payload) {
  const material = await api.put(`/materials/${id}`, payload);
  return transformItem(material);
}

export async function deleteMaterial(id) {
  await api.delete(`/materials/${id}`);
  return true;
}

export async function getMaterial(id) {
  const material = await api.get(`/materials/${id}`);
  return transformItem(material);
}

// Suppliers API
export async function fetchSuppliers(search = "") {
  const params = search ? { search } : {};
  const suppliers = await api.get("/suppliers", params);
  return transformList(suppliers);
}

export async function createSupplier(payload) {
  const supplier = await api.post("/suppliers", payload);
  return transformItem(supplier);
}

export async function updateSupplier(id, payload) {
  const supplier = await api.put(`/suppliers/${id}`, payload);
  return transformItem(supplier);
}

export async function deleteSupplier(id) {
  await api.delete(`/suppliers/${id}`);
  return true;
}

export async function getSupplier(id) {
  const supplier = await api.get(`/suppliers/${id}`);
  return transformItem(supplier);
}

// Customers API
export async function fetchCustomers(search = "") {
  const params = search ? { search } : {};
  const customers = await api.get("/customers", params);
  return transformList(customers);
}

export async function createCustomer(payload) {
  const customer = await api.post("/customers", payload);
  return transformItem(customer);
}

export async function updateCustomer(id, payload) {
  const customer = await api.put(`/customers/${id}`, payload);
  return transformItem(customer);
}

export async function deleteCustomer(id) {
  await api.delete(`/customers/${id}`);
  return true;
}

export async function getCustomer(id) {
  const customer = await api.get(`/customers/${id}`);
  return transformItem(customer);
}

// Sales Orders API
export async function fetchSalesOrders(search = "", filters = {}) {
  const params = { ...filters };
  if (search) params.search = search;
  const orders = await api.get("/sales-orders", params);
  return transformList(orders);
}

export async function createSalesOrder(payload) {
  // Ensure date is in correct format
  const orderData = {
    ...payload,
    date: payload.date || new Date().toISOString(),
    items: payload.items.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  };
  const order = await api.post("/sales-orders", orderData);
  return transformItem(order);
}

export async function updateSalesOrder(id, payload) {
  const orderData = {
    ...payload,
    items: payload.items?.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  };
  const order = await api.put(`/sales-orders/${id}`, orderData);
  return transformItem(order);
}

export async function deleteSalesOrder(id) {
  await api.delete(`/sales-orders/${id}`);
  return true;
}

export async function getSalesOrder(id) {
  const order = await api.get(`/sales-orders/${id}`);
  return transformItem(order);
}

// Purchase Orders API
export async function fetchPurchaseOrders(search = "", filters = {}) {
  const params = { ...filters };
  if (search) params.search = search;
  const orders = await api.get("/purchase-orders", params);
  return transformList(orders);
}

export async function createPurchaseOrder(payload) {
  const orderData = {
    ...payload,
    date: payload.date || new Date().toISOString(),
    materials: payload.materials.map((material) => ({
      materialId: material.materialId,
      quantity: material.quantity,
      unitCost: material.unitCost,
    })),
  };
  const order = await api.post("/purchase-orders", orderData);
  return transformItem(order);
}

export async function updatePurchaseOrder(id, payload) {
  const orderData = {
    ...payload,
    materials: payload.materials?.map((material) => ({
      materialId: material.materialId,
      quantity: material.quantity,
      unitCost: material.unitCost,
    })),
  };
  const order = await api.put(`/purchase-orders/${id}`, orderData);
  return transformItem(order);
}

export async function deletePurchaseOrder(id) {
  await api.delete(`/purchase-orders/${id}`);
  return true;
}

export async function getPurchaseOrder(id) {
  const order = await api.get(`/purchase-orders/${id}`);
  return transformItem(order);
}

// Payments API
export async function fetchPayments(search = "", filters = {}) {
  const params = { ...filters };
  if (search) params.search = search;
  const payments = await api.get("/payments", params);
  return transformList(payments);
}

export async function createPayment(payload) {
  const payment = await api.post("/payments", payload);
  return transformItem(payment);
}

export async function updatePayment(id, payload) {
  const payment = await api.put(`/payments/${id}`, payload);
  return transformItem(payment);
}

export async function deletePayment(id) {
  await api.delete(`/payments/${id}`);
  return true;
}

export async function getPayment(id) {
  const payment = await api.get(`/payments/${id}`);
  return transformItem(payment);
}

// Inventory API
export async function fetchInventory(search = "") {
  const params = search ? { search } : {};
  const inventory = await api.get("/inventory", params);
  return inventory.map((inv) => ({
    ...inv,
    id: inv.id || inv._id,
    itemId: inv.itemId?._id || inv.itemId,
    itemName: inv.itemName || inv.itemId?.name,
  }));
}

// Reports API
export async function getSalesOrderReport(filters = {}) {
  const report = await api.get("/reports/sales-orders", filters);
  return {
    orders: transformList(report.orders || []),
    totalSales: report.totalSales || 0,
  };
}

export async function getPurchaseOrderReport(filters = {}) {
  const report = await api.get("/reports/purchase-orders", filters);
  return {
    orders: transformList(report.orders || []),
    totalPurchases: report.totalPurchases || 0,
  };
}

export async function getCustomerPaymentReport(filters = {}) {
  const report = await api.get("/reports/customer-payments", filters);
  return {
    payments: transformList(report.payments || []),
    totalPayments: report.totalPayments || 0,
  };
}

// Auth API
export async function login(username, password) {
  const response = await api.post("/auth/login", { username, password });
  return response;
}

export async function register(username, password, role) {
  const response = await api.post("/auth/register", { username, password, role });
  return response;
}

export async function getCurrentUser() {
  const user = await api.get("/auth/me");
  return user;
}


export function setToken(token) {
  if (typeof window === "undefined") return; // avoid SSR issues
  localStorage.setItem("auth_token", token);
}

export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}