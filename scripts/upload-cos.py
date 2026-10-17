#!/usr/bin/env python3
"""把本地图片上传到腾讯云 COS 对象存储（仅依赖 Python 标准库）。

用法:
    python scripts/upload-cos.py <本地文件> [--key <对象键>] [--bucket] [--region] [--prefix]

密钥来源（按优先级）:
    1. 环境变量 COS_SECRET_ID / COS_SECRET_KEY
    2. 项目根目录 .env.local 中的 COS_SECRET_ID / COS_SECRET_KEY

默认对象键: <prefix>/<文件相对于仓库根的路径>
"""

import argparse
import hashlib
import hmac
import mimetypes
import os
import posixpath
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

DEFAULT_BUCKET = "rotblog-pic-1322347792"
DEFAULT_REGION = "ap-guangzhou"
DEFAULT_PREFIX = "rot-blog-images"


def load_env_file(path: Path):
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


def get_credentials():
    load_env_file(REPO_ROOT / ".env.local")
    secret_id = os.environ.get("COS_SECRET_ID")
    secret_key = os.environ.get("COS_SECRET_KEY")
    if not secret_id or not secret_key:
        sys.exit(
            "缺少 COS 密钥，请设置环境变量 COS_SECRET_ID / COS_SECRET_KEY，"
            "或写入项目根目录 .env.local"
        )
    return secret_id, secret_key


def build_authorization(secret_id, secret_key, method, key_path, headers, params):
    now = int(time.time())
    key_time = f"{now - 60};{now + 3600}"

    normalized_headers = {k.lower(): str(v) for k, v in headers.items()}
    header_keys = sorted(normalized_headers)
    param_keys = sorted(k.lower() for k in params)

    http_headers = "&".join(
        f"{urllib.parse.quote(k, safe='')}={urllib.parse.quote(normalized_headers[k], safe='')}"
        for k in header_keys
    )
    http_params = "&".join(
        f"{urllib.parse.quote(k, safe='')}={urllib.parse.quote(str(params[k]), safe='')}"
        for k in param_keys
    )
    http_string = f"{method.lower()}\n{key_path}\n{http_params}\n{http_headers}\n"

    sign_key = hmac.new(secret_key.encode(), key_time.encode(), hashlib.sha1).hexdigest()
    string_to_sign = (
        f"sha1\n{key_time}\n{hashlib.sha1(http_string.encode()).hexdigest()}\n"
    )
    signature = hmac.new(sign_key.encode(), string_to_sign.encode(), hashlib.sha1).hexdigest()

    return (
        "q-sign-algorithm=sha1"
        f"&q-ak={secret_id}"
        f"&q-sign-time={key_time}"
        f"&q-key-time={key_time}"
        f"&q-header-list={';'.join(header_keys)}"
        f"&q-url-param-list={';'.join(param_keys)}"
        f"&q-signature={signature}"
    )


def upload(local_file: Path, key: str, bucket: str, region: str):
    body = local_file.read_bytes()
    content_type = mimetypes.guess_type(local_file.name)[0] or "application/octet-stream"

    host = f"{bucket}.cos.{region}.myqcloud.com"
    # 签名用的路径保持原始字符（COS 服务端按未编码路径规范化），请求 URL 才做百分号编码
    key_path = "/" + key.lstrip("/")
    url = f"https://{host}/{urllib.parse.quote(key.lstrip('/'), safe='/~')}"

    headers = {
        "Host": host,
        "Content-Type": content_type,
        "Content-Length": str(len(body)),
    }
    secret_id, secret_key = get_credentials()
    # 临时密钥（STS / CloudBase）需要携带 session token
    session_token = os.environ.get("COS_SESSION_TOKEN") or os.environ.get(
        "TENCENTCLOUD_SESSION_TOKEN"
    )
    if session_token:
        headers["x-cos-security-token"] = session_token
    headers["Authorization"] = build_authorization(
        secret_id, secret_key, "put", key_path, headers, {}
    )

    req = urllib.request.Request(url, data=body, headers=headers, method="PUT")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            if resp.status != 200:
                sys.exit(f"上传失败，HTTP {resp.status}: {resp.read().decode('utf-8', 'ignore')}")
    except urllib.error.HTTPError as e:
        sys.exit(f"上传失败，HTTP {e.code}: {e.read().decode('utf-8', 'ignore')}")

    return f"https://{host}/{urllib.parse.quote(key.lstrip('/'), safe='/')}"


def main():
    parser = argparse.ArgumentParser(description="上传文件到腾讯云 COS")
    parser.add_argument("file", help="本地文件路径")
    parser.add_argument("--key", help="COS 对象键，默认按仓库相对路径推导")
    parser.add_argument("--bucket", default=DEFAULT_BUCKET)
    parser.add_argument("--region", default=DEFAULT_REGION)
    parser.add_argument("--prefix", default=DEFAULT_PREFIX)
    args = parser.parse_args()

    local_file = Path(args.file).resolve()
    if not local_file.is_file():
        sys.exit(f"文件不存在: {local_file}")

    if args.key:
        key = args.key.lstrip("/")
    else:
        rel = local_file.relative_to(REPO_ROOT).as_posix()
        key = posixpath.join(args.prefix, rel)

    url = upload(local_file, key, args.bucket, args.region)
    print(url)


if __name__ == "__main__":
    main()
