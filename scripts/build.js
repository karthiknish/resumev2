#!/usr/bin/env node

/**
 * Custom build script for Vercel deployment
 *
 * This script:
 * 1. Installs dependencies
 * 2. Manually applies the Ajv patch
 * 3. Runs the Next.js build
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Function to run a command and log output
function runCommand(command) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

// Function to manually apply the Ajv patch
function applyAjvPatch() {
  console.log("Manually applying Ajv patch...");

  const ajvDir = path.join(
    process.cwd(),
    "node_modules/ajv/dist/compile/codegen"
  );
  const indexJsPath = path.join(ajvDir, "index.js");

  // Create directory if it doesn't exist
  if (!fs.existsSync(ajvDir)) {
    fs.mkdirSync(ajvDir, { recursive: true });
  }

  // Content for the index.js file
  const content = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._Code = exports.code = void 0;
var codegen_1 = require("./codegen");
Object.defineProperty(exports, "code", { enumerable: true, get: function () { return codegen_1.code; } });
Object.defineProperty(exports, "_Code", { enumerable: true, get: function () { return codegen_1._Code; } });
Object.defineProperty(exports, "str", { enumerable: true, get: function () { return codegen_1.str; } });
Object.defineProperty(exports, "strConcat", { enumerable: true, get: function () { return codegen_1.strConcat; } });
Object.defineProperty(exports, "nil", { enumerable: true, get: function () { return codegen_1.nil; } });
Object.defineProperty(exports, "getProperty", { enumerable: true, get: function () { return codegen_1.getProperty; } });
Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return codegen_1.stringify; } });
Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function () { return codegen_1.regexpCode; } });
Object.defineProperty(exports, "Name", { enumerable: true, get: function () { return codegen_1.Name; } });
Object.defineProperty(exports, "Scope", { enumerable: true, get: function () { return codegen_1.Scope; } });
Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function () { return codegen_1.ValueScope; } });
Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function () { return codegen_1.ValueScopeName; } });
Object.defineProperty(exports, "varKinds", { enumerable: true, get: function () { return codegen_1.varKinds; } });
Object.defineProperty(exports, "operators", { enumerable: true, get: function () { return codegen_1.operators; } });
Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function () { return codegen_1.CodeGen; } });
var util_1 = require("../util");
Object.defineProperty(exports, "not", { enumerable: true, get: function () { return util_1.not; } });
Object.defineProperty(exports, "and", { enumerable: true, get: function () { return util_1.and; } });
Object.defineProperty(exports, "or", { enumerable: true, get: function () { return util_1.or; } });
//# sourceMappingURL=index.js.map`;

  // Write the file
  fs.writeFileSync(indexJsPath, content);
  console.log("Ajv patch applied successfully");
}

// Main function
async function main() {
  console.log("Starting custom build process...");

  // Install dependencies
  runCommand("npm install");
  
  // Install additional dependencies needed for build
  runCommand(
    "npm install tailwindcss@3.4.1 postcss@8.4.35 autoprefixer@10.4.17 @tailwindcss/typography@0.5.10 tailwindcss-animate@1.0.7 @heroicons/react @google-cloud/text-to-speech css-minimizer-webpack-plugin webpack-bundle-analyzer --save"
  );
  
  // Install dev dependencies
  runCommand(
    "npm install typescript@5.7.3 @types/react@18.3.18 @types/node@20.11.5 --no-save"
  );

  // Set environment variable to disable Sharp
  process.env.NODE_ENV = "production";
  
  // Apply Ajv patch
  applyAjvPatch();

  // Run Next.js build
  runCommand("npm run build");

  console.log("Build completed successfully");
}

main().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
