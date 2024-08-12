在众多ubuntu版本的选择中兜兜转转，我最后还是选择了稳定的20.04。

本人之前已经安装过一次ROS，也成功地导入了Urdf文件，

官方的安装教程：https://wiki.ros.org/cn/noetic/Installation/Ubuntu

```bash
sudo apt update
sudo apt upgrade
```

找到系统里/etc/apt里面的source.list，然后
```bash
sudo chmod 777 sources.list
```
修改为可写文件，换源，可换清华源和阿里源。

或者是在ubuntu的软件与更新里更换。

![4](https://github.com/user-attachments/assets/ec63e632-e5ce-4084-b054-97151b1c236f)

![5](https://github.com/user-attachments/assets/a141c00b-a6d1-41b8-a620-5de74fcf1c02)


```bash
将其中 http://cn.archive.ubuntu.com 全部替换成阿里源 http://mirrors.aliyun.com
```

一定要sudo apt update和sudo apt upgrade才算换完源。

```bash
sudo apt install pip
```
发现已经以python3-pip的包存在于系统中。

```bash
# 清华源下载
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'
# gpg导入
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
# 确认软件包是新的
sudo apt update
# ubuntu 20.04 选择noetic
sudo apt install ros-noetic-desktop-full
# 在使用ROS的每个bash终端中source这个脚本。
source /opt/ros/noetic/setup.bash
# 每次自动source一下这个脚本
echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

官网给出了rosdep的初始化和升级方法，但是大概率跑不通，国内需要换用小鱼（鱼香ROS）写的rosdepc。（需要sudo apt install pip）
```bash
sudo pip install rosdepc
sudo rosdepc init
rosdepc update
```
现在应该已经装好了catkin。
```bash
mkdir -p ~/catkin_ws/src
cd ~/catkin_ws
catkin_make
```
应该已经成功catkin_make。
```bash
roscore
```
尝试启动ros，成功~

