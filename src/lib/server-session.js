import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "./session";

export async function getSessionId() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || "";
}
