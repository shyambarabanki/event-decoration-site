import fs from "fs/promises";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "log");

function serializeError(error) {
  if (!error) return null;

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  if (typeof error === "object") return error;
  return { message: String(error) };
}

function safeJson(value) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return { message: "Unable to serialize log metadata" };
  }
}

export async function writeLog(level, source, message, metadata = {}) {
  const now = new Date();
  const fileName = `${now.toISOString().slice(0, 10)}.log`;
  const entry = {
    timestamp: now.toISOString(),
    level,
    source,
    message,
    metadata: safeJson(metadata),
  };

  await fs.mkdir(LOG_DIR, { recursive: true });
  await fs.appendFile(path.join(LOG_DIR, fileName), `${JSON.stringify(entry)}\n`, "utf8");
}

export async function logError(source, error, metadata = {}) {
  await writeLog("error", source, error?.message || String(error), {
    ...metadata,
    error: serializeError(error),
  });
}

export async function logInfo(source, message, metadata = {}) {
  await writeLog("info", source, message, metadata);
}

