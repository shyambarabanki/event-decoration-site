import fs from "fs/promises";
import path from "path";

const ORDER_STORE_PATH = path.join(process.cwd(), "data", "orders.jsonl");

async function ensureStore() {
  await fs.mkdir(path.dirname(ORDER_STORE_PATH), { recursive: true });
}

export function createBookingId() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PB-${Date.now().toString(36).toUpperCase()}-${suffix}`;
}

export async function appendOrder(order) {
  await ensureStore();
  await fs.appendFile(ORDER_STORE_PATH, `${JSON.stringify(order)}\n`, "utf8");
  return order;
}

export async function readOrders() {
  try {
    const content = await fs.readFile(ORDER_STORE_PATH, "utf8");
    return content
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .filter((order) => order && typeof order === "object");
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

export async function getOrdersBySession(sessionId) {
  if (!sessionId) return [];
  const orders = await readOrders();
  return orders
    .filter((order) => order.sessionId === sessionId)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export async function updateOrderByBookingId(bookingId, sessionId, updates) {
  if (!bookingId) return null;

  const orders = await readOrders();
  const index = orders.findIndex(
    (order) => order.bookingId === bookingId && (!sessionId || order.sessionId === sessionId)
  );

  if (index === -1) return null;

  const updatedOrder = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  orders[index] = updatedOrder;
  await ensureStore();
  await fs.writeFile(
    ORDER_STORE_PATH,
    orders.map((order) => JSON.stringify(order)).join("\n") + "\n",
    "utf8"
  );

  return updatedOrder;
}

