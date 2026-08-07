// ============================================================
// 批量替换 HTML 文件里的图片路径为 R2 CDN 域名
// 用法: node replace-images.js
// 依赖: Node.js (已安装)
// ============================================================

const fs = require('fs');
const path = require('path');

// ---- 配置区,按需修改 ----
const PROJECT_DIR = __dirname;              // 默认是脚本所在目录,如果脚本和网站文件不在同一层,改成实际项目路径
const CDN_BASE = 'https://img.titansportgear.com';
const SKIP_DIRS = ['node_modules', '.git', 'compress', 'grid_bot-main'];
const FILE_EXTENSIONS = ['.html', '.css', '.js'];
// --------------------------

let totalFiles = 0;
let totalReplacements = 0;
const changedFiles = [];

function replaceImagePaths(content) {
  let count = 0;

  content = content.replace(/src="\/?images\/([^"]+)"/g, (match, p1) => {
    count++;
    return `src="${CDN_BASE}/${p1}"`;
  });

  content = content.replace(/src='\/?images\/([^']+)'/g, (match, p1) => {
    count++;
    return `src='${CDN_BASE}/${p1}'`;
  });

  content = content.replace(/url\((['"]?)\/?images\/([^'")]+)\1\)/g, (match, quote, p1) => {
    count++;
    return `url(${quote}${CDN_BASE}/${p1}${quote})`;
  });

  return { content, count };
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRS.includes(entry.name)) continue;
      walk(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!FILE_EXTENSIONS.includes(ext)) continue;

      const original = fs.readFileSync(fullPath, 'utf8');
      const { content, count } = replaceImagePaths(original);

      totalFiles++;

      if (count > 0) {
        fs.writeFileSync(fullPath, content, 'utf8');
        totalReplacements += count;
        changedFiles.push({ file: path.relative(PROJECT_DIR, fullPath), count });
      }
    }
  }
}

console.log(`扫描目录: ${PROJECT_DIR}`);
console.log('-----------------------------------------------------');

walk(PROJECT_DIR);

console.log('-----------------------------------------------------');
if (changedFiles.length === 0) {
  console.log('没有找到需要替换的图片路径。请检查 PROJECT_DIR 路径是否正确。');
} else {
  changedFiles.forEach(({ file, count }) => {
    console.log(`✓ ${file} — 替换了 ${count} 处`);
  });
  console.log('-----------------------------------------------------');
  console.log(`共扫描 ${totalFiles} 个文件,修改了 ${changedFiles.length} 个文件,共替换 ${totalReplacements} 处图片路径。`);
  console.log(`所有图片路径已指向: ${CDN_BASE}`);
}
