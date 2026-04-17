#!/usr/bin/env python3
import socket
import subprocess
import sys
import re
from typing import Optional, Tuple

PORT = 9999
TIMEOUT_MS = 5000
QUERY = "WHO_IS_LUBANCAT"
USERNAME = "cat"

# ANSI 颜色代码 (用于输出美化)
COLOR_RED = "\033[91m"
COLOR_GREEN = "\033[92m"
COLOR_YELLOW = "\033[93m"
COLOR_CYAN = "\033[96m"
COLOR_RESET = "\033[0m"


def get_network_interfaces() -> list:
    """
    获取所有 IPv4 网络接口 (排除回环、198.18.* 和本地链路地址)。
    返回列表，每个元素为 (interface_name, ip_address, netmask)。
    使用系统命令 (Windows: ipconfig, Linux/macOS: ifconfig)。
    """
    interfaces = []
    # 根据操作系统选择命令
    if sys.platform.startswith("win"):
        output = subprocess.run(
            ["ipconfig", "/all"],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="ignore",
        ).stdout
        # 解析 Windows ipconfig 输出
        lines = output.splitlines()
        current_adapter = None
        ipv4_pattern = re.compile(r"IPv4[^:]*:\s*(\d+\.\d+\.\d+\.\d+)")
        mask_pattern = re.compile(r"子网掩码[^:]*:\s*(\d+\.\d+\.\d+\.\d+)")
        # 适配英文系统: "Subnet Mask" 或 "Mask"
        mask_pattern_en = re.compile(r"Subnet Mask[^:]*:\s*(\d+\.\d+\.\d+\.\d+)", re.IGNORECASE)
        adapter_name_pattern = re.compile(r"适配器\s+(.+?):|Adapter\s+(.+?):", re.IGNORECASE)

        for line in lines:
            # 检测适配器名称
            adapter_match = adapter_name_pattern.search(line)
            if adapter_match:
                current_adapter = adapter_match.group(1) or adapter_match.group(2)
                current_adapter = current_adapter.strip()
                continue
            if not current_adapter:
                continue

            ip_match = ipv4_pattern.search(line)
            mask_match = mask_pattern.search(line) or mask_pattern_en.search(line)
            if ip_match and mask_match:
                ip = ip_match.group(1)
                mask = mask_match.group(1)
                # 排除回环、198.18.* 和本地链路
                if ip.startswith("127.") or ip.startswith("198.18.") or ip.startswith("169.254."):
                    continue
                interfaces.append((current_adapter, ip, mask))
    else:
        # Linux / macOS: 使用 ifconfig
        output = subprocess.run(
            ["ifconfig"], capture_output=True, text=True, encoding="utf-8", errors="ignore"
        ).stdout
        # 解析 ifconfig 输出 (支持 inet addr: 或 inet 格式)
        blocks = output.split("\n\n")
        for block in blocks:
            # 提取接口名
            iface_match = re.match(r"(\w+):", block)
            if not iface_match:
                continue
            iface = iface_match.group(1)
            # 提取 IPv4 地址和掩码
            ip_match = re.search(r"inet (?:addr:)?(\d+\.\d+\.\d+\.\d+)", block)
            mask_match = re.search(r"netmask (?:0x[0-9a-f]+|(\d+\.\d+\.\d+\.\d+))", block)
            if ip_match and mask_match:
                ip = ip_match.group(1)
                mask = mask_match.group(1) if mask_match.group(1) else "255.255.255.0"  # 简化处理
                if ip.startswith("127.") or ip.startswith("198.18.") or ip.startswith("169.254."):
                    continue
                interfaces.append((iface, ip, mask))

    return interfaces


def mask_to_prefixlen(mask: str) -> int:
    """将点分十进制子网掩码转换为前缀长度 (0-32)"""
    try:
        parts = mask.split(".")
        if len(parts) != 4:
            return 24  # 默认 /24
        binary = "".join([bin(int(p))[2:].zfill(8) for p in parts])
        return binary.count("1")
    except:
        return 24


def compute_broadcast(ip: str, prefixlen: int) -> str:
    """根据 IP 和前缀长度计算定向广播地址，若非 /24 则返回全局广播 255.255.255.255"""
    if prefixlen != 24:
        return "255.255.255.255"
    # 计算 /24 子网的广播地址
    parts = ip.split(".")
    if len(parts) == 4:
        return f"{parts[0]}.{parts[1]}.{parts[2]}.255"
    return "255.255.255.255"


def select_best_interface(interfaces: list) -> Optional[Tuple[str, str, int]]:
    """
    从接口列表中选择最佳接口：优先 WLAN/Wi-Fi，否则选第一个。
    返回 (ip, prefixlen, interface_name)
    """
    wlan_iface = None
    for name, ip, mask in interfaces:
        if re.search(r"WLAN|Wi-Fi|无线|wlan|wifi", name, re.IGNORECASE):
            wlan_iface = (name, ip, mask)
            break
    if wlan_iface:
        name, ip, mask = wlan_iface
        prefixlen = mask_to_prefixlen(mask)
        print(f"{COLOR_GREEN}Selected WLAN interface: {name}{COLOR_RESET}")
        return (ip, prefixlen, name)
    elif interfaces:
        name, ip, mask = interfaces[0]
        prefixlen = mask_to_prefixlen(mask)
        print(f"{COLOR_YELLOW}No WLAN found, using: {name}{COLOR_RESET}")
        return (ip, prefixlen, name)
    else:
        return None


def udp_broadcast_search(broadcast_addr: str, query: str, port: int, timeout_ms: int) -> Optional[str]:
    """
    发送 UDP 广播查询，等待响应并返回响应的 IP 字符串。
    """
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    sock.settimeout(timeout_ms / 1000.0)  # 转换为秒

    try:
        # 发送查询
        data = query.encode("utf-8")
        sock.sendto(data, (broadcast_addr, port))
        print(f"{COLOR_GREEN}Broadcast sent to {broadcast_addr}:{port}{COLOR_RESET}")

        # 接收响应
        resp_data, remote_addr = sock.recvfrom(1024)
        ip = resp_data.decode("utf-8").strip()
        print(f"{COLOR_GREEN}Found LubanCat at IP: {ip}{COLOR_RESET}")
        return ip
    except socket.timeout:
        print(f"{COLOR_YELLOW}Timeout or error: No response within {timeout_ms} ms{COLOR_RESET}")
        return None
    except Exception as e:
        print(f"{COLOR_RED}Socket error: {e}{COLOR_RESET}")
        return None
    finally:
        sock.close()


def start_ssh(ip: str, username: str):
    """启动 SSH 客户端连接到目标 IP"""
    try:
        # Windows 下使用 start 或直接 ssh；Linux/macOS 直接 ssh
        cmd = ["ssh", f"{username}@{ip}"]
        print(f"{COLOR_GREEN}Launching SSH to {username}@{ip}...{COLOR_RESET}")
        subprocess.run(cmd)
    except FileNotFoundError:
        print(f"{COLOR_RED}SSH client not found. Please install OpenSSH client.{COLOR_RESET}")
    except Exception as e:
        print(f"{COLOR_RED}Failed to start SSH: {e}{COLOR_RESET}")


def main():
    # 1. 获取网络接口
    interfaces = get_network_interfaces()
    if not interfaces:
        print(f"{COLOR_RED}No suitable network interface found{COLOR_RESET}")
        sys.exit(1)

    # 2. 选择最佳接口
    selected = select_best_interface(interfaces)
    if not selected:
        print(f"{COLOR_RED}No usable network interface selected{COLOR_RESET}")
        sys.exit(1)
    local_ip, prefixlen, iface_name = selected
    print(f"{COLOR_CYAN}Local IP: {local_ip}{COLOR_RESET}")

    # 3. 计算广播地址
    broadcast = compute_broadcast(local_ip, prefixlen)
    if broadcast == "255.255.255.255" and prefixlen != 24:
        print(f"{COLOR_YELLOW}Warning: non-/24 subnet, using global broadcast{COLOR_RESET}")
    print(f"{COLOR_CYAN}Broadcast: {broadcast}{COLOR_RESET}")

    # 4. UDP 广播查询
    target_ip = udp_broadcast_search(broadcast, QUERY, PORT, TIMEOUT_MS)
    if not target_ip:
        sys.exit(1)

    # 5. 启动 SSH
    start_ssh(target_ip, USERNAME)


if __name__ == "__main__":
    main()