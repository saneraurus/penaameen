import { execSync } from "node:child_process";
import process from "node:process";

const checks = [
  ["static-check", "npm run check"],
  ["browser-e2e", "npm run test:e2e"],
];

for (const [name, command] of checks) {
  console.log(`LAUNCH_GATE_START=${name}`);
  try {
    execSync(command, {
      stdio: "inherit",
      env: process.env,
      shell: true,
    });
    console.log(`LAUNCH_GATE=${name}:passed`);
  } catch {
    console.error(`LAUNCH_GATE=${name}:failed`);
    process.exitCode = 1;
    break;
  }
}

if (!process.exitCode) {
  console.log("LAUNCH_GATE=local-code-ready-external-approval-required");
}
