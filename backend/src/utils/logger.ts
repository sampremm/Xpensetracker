// src/utils/logger.ts
export const log = {
  info: (...msgs: any[]) => console.log("[INFO]", ...msgs),
  error: (...msgs: any[]) => console.error("[ERROR]", ...msgs)
};
