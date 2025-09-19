// scripts/removeWooDashboard.js
const fs = require("fs");
const path = require("path");

const file = path.join(
  __dirname,
  "..",
  "client",
  "src",
  "pages",
  "ProductManagement.tsx"
);

// 1) Load file
let code = fs.readFileSync(file, "utf8");
const before = code.length;

// 2) Remove the WooCommerce Dashboard <Card> … </Card>
// We target the explicit marker comment to be safe
const dashboardCard = new RegExp(
  String.raw`\{\s*/\*\s*Unified\s+WooCommerce\s+Import\s+Dashboard\s*\*/\s*\}\s*<Card>[\s\S]*?</Card>`,
  "i"
);
code = code.replace(dashboardCard, "");

// 3) Remove the specific state for the old dashboard (if present)
const oldState = new RegExp(
  String.raw`//\s*Separate\s+connection\s+state\s+for\s+old\s+WooCommerce\s+dashboard\s*\(being\s+phased\s+out\)\s*\n\s*const\s*\[\s*woocommerceDashboardConnected\s*,\s*setWoocommerceDashboardConnected\s*\]\s*=\s*useState\([^;]+;\s*\n`,
  "i"
);
code = code.replace(oldState, "");

// 4) Remove the old toggle function (if present)
const oldToggle = new RegExp(
  String.raw`const\s+toggleWoocommerceDashboard\s*=\s*\(\)\s*=>\s*\{\s*[\s\S]*?\};\s*`,
  "i"
);
code = code.replace(oldToggle, "");

// 5) Save the file
fs.writeFileSync(file, code, "utf8");

// 6) Disable any stray backup that can confuse hot-reload
const backup = path.join(
  __dirname,
  "..",
  "client",
  "src",
  "pages",
  "ProductManagement.backup.tsx"
);
if (fs.existsSync(backup)) {
  fs.renameSync(backup, backup + ".disabled");
}

console.log("Patched ProductManagement.tsx");
console.log("Before chars:", before, "After chars:", code.length);