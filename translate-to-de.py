#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
使用百度翻译 API 批量把英文 HTML 页面翻译成德文
自动只翻译文字内容，保留所有 HTML 标签、属性、代码结构不变

使用前准备：
1. 前往 https://fanyi-api.baidu.com/ 注册开发者账号，创建应用
   拿到 APP ID 和密钥（Secret Key）
2. 安装依赖：pip install requests beautifulsoup4 --break-system-packages

使用方法：
python translate_to_de.py 英文文件.html 输出的德文文件.html
"""

import sys
import time
import random
import hashlib
import requests
from bs4 import BeautifulSoup, NavigableString, Comment

# ========== 在这里填入你的百度翻译 APP ID 和密钥 ==========
BAIDU_APP_ID = "20260708002644594"
BAIDU_SECRET_KEY = "chpLCJJ80ondL3D7bAPh"
# ==========================================================

BAIDU_API_URL = "https://fanyi-api.baidu.com/api/trans/vip/translate"

# 不翻译这些标签内部的文字（脚本、样式、代码等）
SKIP_TAGS = {"script", "style", "code", "pre", "noscript"}


def baidu_translate(text, from_lang="en", to_lang="de"):
    """调用百度翻译 API 翻译一段文字。始终返回字符串，绝不返回 None。"""
    if not text or not text.strip():
        return text

    salt = str(random.randint(32768, 65536))
    sign_str = BAIDU_APP_ID + text + salt + BAIDU_SECRET_KEY
    sign = hashlib.md5(sign_str.encode("utf-8")).hexdigest()

    params = {
        "q": text,
        "from": from_lang,
        "to": to_lang,
        "appid": BAIDU_APP_ID,
        "salt": salt,
        "sign": sign,
    }

    try:
        resp = requests.get(BAIDU_API_URL, params=params, timeout=10)
        result = resp.json()

        if "trans_result" in result and result.get("trans_result"):
            dst_list = [item.get("dst") for item in result["trans_result"] if item.get("dst") is not None]
            if dst_list:
                return "\n".join(dst_list)
            else:
                print(f"  [翻译异常，dst为空] 完整返回: {result}  原文: {text[:50]}")
                return text
        else:
            # 常见错误码：52003签名错误 54001无效签名 58000客户端IP未绑定 等
            error_code = result.get("error_code", "未知")
            error_msg = result.get("error_msg", "未知")
            print(f"  [翻译接口报错] error_code={error_code} error_msg={error_msg}  完整返回: {result}")
            return text
    except Exception as e:
        print(f"  [请求出错] {e}  原文: {text[:50]}")
        return text


def should_translate(text):
    """判断这段文字是否值得翻译（跳过纯符号、纯数字、太短的内容）"""
    stripped = text.strip()
    if not stripped:
        return False
    if len(stripped) <= 1:
        return False
    if stripped.isdigit():
        return False
    return True


def translate_html_file(input_path, output_path):
    print(f"正在读取: {input_path}")
    with open(input_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")

    # 更新 html 标签的 lang 属性
    html_tag = soup.find("html")
    if html_tag and html_tag.has_attr("lang"):
        html_tag["lang"] = "de"

    # 收集所有需要翻译的文字节点
    text_nodes = []
    for element in soup.find_all(string=True):
        if isinstance(element, Comment):
            continue
        parent = element.parent
        if parent and parent.name in SKIP_TAGS:
            continue
        if should_translate(str(element)):
            text_nodes.append(element)

    # 常见需要翻译的属性（如 alt, title, placeholder, content）
    attr_translate_list = ["alt", "title", "placeholder"]
    attr_targets = []
    for tag in soup.find_all(True):
        for attr in attr_translate_list:
            if tag.has_attr(attr) and should_translate(tag[attr]):
                attr_targets.append((tag, attr))
        # meta description / keywords
        if tag.name == "meta" and tag.get("name") in ("description", "keywords") and tag.has_attr("content"):
            if should_translate(tag["content"]):
                attr_targets.append((tag, "content"))

    total = len(text_nodes) + len(attr_targets)
    print(f"共找到 {total} 处需要翻译的文字，开始翻译...\n")

    count = 0
    for element in text_nodes:
        original = str(element)
        translated = baidu_translate(original)
        element.replace_with(NavigableString(translated))
        count += 1
        print(f"[{count}/{total}] {original.strip()[:40]!r} -> {translated.strip()[:40]!r}")
        time.sleep(1.1)  # 避免请求过快触发限流

    for tag, attr in attr_targets:
        original = tag[attr]
        translated = baidu_translate(original)
        tag[attr] = translated
        count += 1
        print(f"[{count}/{total}] [{attr}] {original[:40]!r} -> {translated[:40]!r}")
        time.sleep(1.1)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(str(soup))

    print(f"\n完成！已保存到: {output_path}")
    print("提醒：机器翻译仅供初稿参考，建议找懂德语的人再校对一遍关键页面（首页、About、Contact）。")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("用法: python translate_to_de.py 输入的英文html 输出的德文html")
        print("示例: python translate_to_de.py Badminton.html de/Badminton.html")
        sys.exit(1)

    if BAIDU_APP_ID == "你的APP_ID" or BAIDU_SECRET_KEY == "你的密钥":
        print("请先在脚本开头填入你申请到的 BAIDU_APP_ID 和 BAIDU_SECRET_KEY，再运行。")
        sys.exit(1)

    translate_html_file(sys.argv[1], sys.argv[2])