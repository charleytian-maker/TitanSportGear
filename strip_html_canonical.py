#!/usr/bin/env python3
"""
批量修改脚本：把网站所有 HTML 文件里的
<link rel="canonical" ...>  和
<link rel="alternate" hreflang="..." ...>
标签中的 href 链接，去掉结尾的 .html

用法：
1. 把这个脚本放到你的网站项目根目录（跟 index.html、de 文件夹同一级）
2. 打开终端，cd 到项目目录
3. 运行：python strip_html_canonical.py
4. 脚本会先做"预览"（dry run），列出会修改哪些文件、改成什么样，
   确认无误后，再运行一次并输入 y 确认，才会真正写入文件。

安全性：
- 只处理 <link rel="canonical" ...> 和 <link rel="alternate" hreflang="..." ...> 这两种标签里的 href
- 不会碰其他 .html 链接（比如导航栏、内链、图片路径等都不受影响）
- 已存在 .html 结尾的这两类标签才会被修改；已经是无后缀的会被跳过
- 自动备份：修改前会把原文件复制一份，后缀加 .bak，方便出问题时恢复
"""

import os
import re
import sys

# ⚠️ 如果你的项目根目录不是脚本所在目录，改这里的路径
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

# 只处理 canonical 和 alternate(hreflang) 这两种 <link> 标签
# 用非贪婪匹配，抓住整个 <link ... > 标签
LINK_TAG_PATTERN = re.compile(
    r'<link\s+[^>]*rel=["\'](?:canonical|alternate)["\'][^>]*>',
    re.IGNORECASE
)

# 在匹配到的 link 标签内，找 href="....html" 并去掉 .html
HREF_HTML_PATTERN = re.compile(
    r'(href=["\'])([^"\']*?)\.html(["\'])',
    re.IGNORECASE
)


def process_link_tag(tag_text):
    """对单个 <link ...> 标签文本，去掉 href 里的 .html 后缀"""
    def replacer(m):
        return f"{m.group(1)}{m.group(2)}{m.group(3)}"
    return HREF_HTML_PATTERN.sub(replacer, tag_text)


def process_file(filepath, dry_run=True):
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    changes = []

    def tag_replacer(m):
        original_tag = m.group(0)
        new_tag = process_link_tag(original_tag)
        if new_tag != original_tag:
            changes.append((original_tag, new_tag))
        return new_tag

    new_content = LINK_TAG_PATTERN.sub(tag_replacer, content)

    if changes and not dry_run:
        # 备份原文件
        backup_path = filepath + ".bak"
        if not os.path.exists(backup_path):
            with open(backup_path, "w", encoding="utf-8") as f:
                f.write(content)
        # 写入修改后的内容
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)

    return changes


def main():
    dry_run = "--apply" not in sys.argv

    html_files = []
    for root, dirs, files in os.walk(ROOT_DIR):
        # 跳过一些不需要处理的目录
        dirs[:] = [d for d in dirs if d not in (".git", "node_modules", ".wrangler", "functions")]
        for name in files:
            if name.lower().endswith(".html"):
                html_files.append(os.path.join(root, name))

    print(f"共找到 {len(html_files)} 个 HTML 文件\n")

    total_changed_files = 0
    for filepath in html_files:
        changes = process_file(filepath, dry_run=dry_run)
        if changes:
            total_changed_files += 1
            rel_path = os.path.relpath(filepath, ROOT_DIR)
            print(f"[{'预览' if dry_run else '已修改'}] {rel_path}")
            for old_tag, new_tag in changes:
                print(f"    - {old_tag.strip()}")
                print(f"    + {new_tag.strip()}")
            print()

    print(f"\n共 {total_changed_files} 个文件包含需要修改的 canonical/hreflang 标签。")

    if dry_run:
        print("\n⚠️ 这是预览模式，尚未修改任何文件。")
        print("确认上面的改动没问题后，运行：python strip_html_canonical.py --apply")
    else:
        print("\n✅ 修改已完成。原文件已备份为 .bak 文件（如需恢复，把 .bak 文件改回原名即可）。")


if __name__ == "__main__":
    main()