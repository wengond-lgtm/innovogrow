const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist");

const publicDirectories = new Set([
  "assets",
  "content",
  "SVG"
]);

const publicRootExtensions = new Set([
  ".html",
  ".css",
  ".js",
  ".ico",
  ".jpg",
  ".jpeg",
  ".png",
  ".svg",
  ".webp",
  ".txt",
  ".xml",
  ".webmanifest"
]);

function removeDir(target) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function shouldCopyRootEntry(entry) {
  const source = path.join(root, entry);
  const stats = fs.statSync(source);

  if (stats.isDirectory()) {
    return publicDirectories.has(entry);
  }

  return publicRootExtensions.has(path.extname(entry).toLowerCase());
}

function copyRecursive(source, destination) {
  const stats = fs.statSync(source);

  if (stats.isDirectory()) {
    fs.mkdirSync(destination, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(
        path.join(source, entry),
        path.join(destination, entry)
      );
    }
    return;
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

removeDir(output);
fs.mkdirSync(output, { recursive: true });

for (const entry of fs.readdirSync(root)) {
  if (!shouldCopyRootEntry(entry)) {
    continue;
  }

  copyRecursive(path.join(root, entry), path.join(output, entry));
}

console.log(`CloudCannon build complete: ${output}`);
