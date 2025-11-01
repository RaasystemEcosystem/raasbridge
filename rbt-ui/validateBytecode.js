// validateBytecode.js
import fs from "fs";
import path from "path";

const b = fs.readFileSync(path.join("./RBT_BYTECODE.txt"), "utf8").trim().replace(/\s+/g,"");
if (!b.startsWith("0x")) {
  console.error("❌ Bytecode must start with 0x");
  process.exit(1);
}
if (!/^0x[0-9a-fA-F]+$/.test(b)) {
  console.error("❌ Bytecode contains non-hex characters");
  process.exit(1);
}
console.log("✅ Bytecode looks valid. Length (hex chars):", (b.length - 2));

