import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

export const r = (...args: string[]) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return resolve(__dirname, "..", ...args).replace(/\\/g, "/");
};
