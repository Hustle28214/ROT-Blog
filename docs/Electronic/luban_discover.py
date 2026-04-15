#!/usr/bin/env python3
import socket
import subprocess
import sys
import netifaces

# 配置参数
PORT = 9999
TIMEOUT = 5
QUERY = b'WHO_IS_LUBANCAT'
USERNAME = 'cat'          # 修改为您的鲁班猫用户名

def list_interfaces():
    """列出所有非回环的IPv4接口"""
    interfaces = []
    for iface_name in netifaces.interfaces():
        addrs = netifaces.ifaddresses(iface_name)
        if netifaces.AF_INET in addrs:
            for addr in addrs[netifaces.AF_INET]:
                ip = addr['addr']
                netmask = addr.get('netmask', '255.255.255.0')
                if not ip.startswith('127.'):
                    interfaces.append((iface_name, ip, netmask))
    return interfaces

def calculate_broadcast(ip, netmask):
    """根据IP和子网掩码计算广播地址"""
    ip_parts = [int(x) for x in ip.split('.')]
    mask_parts = [int(x) for x in netmask.split('.')]
    broadcast_parts = [(ip_parts[i] & mask_parts[i]) | (255 ^ mask_parts[i]) for i in range(4)]
    return '.'.join(str(p) for p in broadcast_parts)

def main():
    # 1. 获取所有接口
    interfaces = list_interfaces()
    if not interfaces:
        print("未找到任何非回环IPv4接口")
        sys.exit(1)

    # 2. 显示接口列表，让用户选择
    print("找到以下网络接口：")
    for idx, (name, ip, mask) in enumerate(interfaces):
        print(f"  {idx}: {name} - IP: {ip} / 掩码: {mask}")
    
    # 自动尝试选择WLAN或以太网接口（常见名称）
    auto_choice = None
    for idx, (name, ip, mask) in enumerate(interfaces):
        if 'WLAN' in name or 'Wi-Fi' in name or '以太网' in name or 'Ethernet' in name:
            if not ip.startswith('198.18.'):  # 排除Meta虚拟网卡
                auto_choice = idx
                break
    
    if auto_choice is not None:
        print(f"\n自动选择接口 {auto_choice}: {interfaces[auto_choice][0]}")
        choice = auto_choice
    else:
        try:
            choice = int(input("\n请选择正确的接口编号: "))
        except ValueError:
            print("输入无效")
            sys.exit(1)
    
    if choice < 0 or choice >= len(interfaces):
        print("选择超出范围")
        sys.exit(1)
    
    iface_name, local_ip, netmask = interfaces[choice]
    broadcast = calculate_broadcast(local_ip, netmask)
    
    print(f"[*] 使用接口: {iface_name}")
    print(f"[*] 本地IP: {local_ip}")
    print(f"[*] 子网掩码: {netmask}")
    print(f"[*] 广播地址: {broadcast}")

    # 3. 创建UDP socket并绑定到指定接口（重要）
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    # 绑定到指定IP，确保从正确的接口发送
    sock.bind((local_ip, 0))
    sock.settimeout(TIMEOUT)

    try:
        # 发送广播查询
        sock.sendto(QUERY, (broadcast, PORT))
        print(f"[→] 已发送广播查询到 {broadcast}:{PORT}")

        # 接收回复
        data, addr = sock.recvfrom(1024)
        ip = data.decode().strip()
        print(f"[✓] 发现鲁班猫！IP地址: {ip} (来自 {addr[0]})")

        # 启动SSH连接
        print(f"[*] 正在连接 ssh {USERNAME}@{ip} ...")
        subprocess.run(['ssh', f'{USERNAME}@{ip}'])
    except socket.timeout:
        print("[✗] 未收到鲁班猫的响应。请检查：")
        print("    1. 鲁班猫上服务端是否运行")
        print("    2. 防火墙是否允许UDP 9999端口")
        print("    3. 是否在同一子网（鲁班猫IP应该在192.168.10.x）")
    except KeyboardInterrupt:
        print("\n[!] 用户中断")
    finally:
        sock.close()

if __name__ == '__main__':
    # 如果没有安装netifaces，安装一下
    try:
        import netifaces
    except ImportError:
        print("需要安装netifaces库，请执行: pip install netifaces")
        sys.exit(1)
    main()