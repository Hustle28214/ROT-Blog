#!/usr/bin/env python3
"""为 docs 下每个含文档的目录补齐 _category_.json，并按父目录重排 position。

已有配置保持原有相对顺序，新目录按名称追加在其后。
用法: python3 scripts/fix-categories.py [--apply]
"""

import json
import re
import sys
from pathlib import Path

DOCS = Path(__file__).resolve().parent.parent / "docs"
CATEGORY = "_category_.json"
APPLY = "--apply" in sys.argv


def has_docs(directory: Path) -> bool:
    return any(directory.rglob("*.md")) or any(directory.rglob("*.mdx"))


def category_dirs(parent: Path) -> list[Path]:
    return sorted(
        (d for d in parent.iterdir() if d.is_dir() and has_docs(d)),
        key=lambda d: d.name,
    )


def render(label: str, position: int) -> str:
    return json.dumps(
        {"label": label, "position": position, "link": {"type": "generated-index"}},
        ensure_ascii=False,
        indent=2,
    ) + "\n"


created: list[str] = []
renumbered: list[str] = []

parents = [DOCS] + [d for d in DOCS.rglob("*") if d.is_dir() and has_docs(d)]

for parent in sorted(parents):
    children = category_dirs(parent)
    if not children:
        continue

    existing, missing = [], []
    for child in children:
        path = child / CATEGORY
        if path.exists():
            existing.append((json.loads(path.read_text())["position"], child.name, child))
        else:
            missing.append(child)
    existing.sort()

    ordered = [c for _, _, c in existing] + missing
    for position, child in enumerate(ordered, start=1):
        path = child / CATEGORY
        rel = child.relative_to(DOCS)
        if path.exists():
            text = path.read_text()
            old = json.loads(text)["position"]
            if old == position:
                continue
            # 只替换 position 一行，保留文件原有格式
            new_text = re.sub(r'("position"\s*:\s*)\d+', rf"\g<1>{position}", text, count=1)
            renumbered.append(f"{rel}: {old} -> {position}")
            if APPLY:
                path.write_text(new_text)
        else:
            created.append(f"{rel}  (label={child.name}, position={position})")
            if APPLY:
                path.write_text(render(child.name, position))

print(f"新建 {len(created)} 个:")
for line in created:
    print("  +", line)
print(f"\n重排 position {len(renumbered)} 处:")
for line in renumbered:
    print("  ~", line)
print("\n（预演，未写入。加 --apply 生效）" if not APPLY else "\n已写入。")
