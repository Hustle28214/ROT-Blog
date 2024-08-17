## 1. 使用shell

shell是最基本的命令行工具，它提供了许多命令，如ls、cd、pwd、mkdir、rm、cp、mv、cat、echo、grep、find、sort、wc、head、tail、less、more、man、history、clear、exit等。它是一种文字接口。

## 2. 课后练习

原链接：https://missing-semester-cn.github.io/2020/course-shell/

本次练习使用WSL终端完成。

> 使用 echo $SHELL 命令可以查看您的 shell 是否满足要求

> 在 /tmp 下新建一个名为 missing 的文件夹。

1. 不太优雅的做法

```bash
# 由于我知道tmp文件夹是在根目录下一级，直接cd进入
cd /tmp
mkdir missing
```

2. 优雅一点的做法

```bash
# find查询
find / -type d -name "tmp" 2>/dev/null
```

> 用 man 查看程序 touch 的使用手册。

```bash
man touch
```

> 用 touch 在 missing 文件夹中新建一个叫 semester 的文件。
```bash
touch /tmp/missing/semester
```

> 使用 chmod 命令改变权限，使 ./semester 能够成功执行，不要使用 sh semester 来执行该程序。
```bash
sudo chmod 777 /tmp/missing/semester
```
您的 shell 是如何知晓这个文件需要使用 sh 来解析呢？这涉及到 shell 的解析器。 在semester文件中有#!/bin/sh开头这一行，也就是说文件中存在Shebang（#!），它指示了shell如何解析这个文件。程序加载器会分析Shebang后的内容，将这些内容作为解释器指令，并调用该指令，并将载有Shebang的文件路径作为该解释器的参数。

#!/bin/sh—使用sh，即Bourne shell或其它兼容shell执行脚本。/bin/sh软链接或硬链接到Bash。


> 使用 | 和 > ，将 semester 文件输出的最后更改日期信息，写入主目录下的 last-modified.txt 的文件中

```bash
chengzhu@DESKTOP-TPDC2FU:~$ cd /tmp/missing
chengzhu@DESKTOP-TPDC2FU:/tmp/missing$ stat -c %y semester | tee ~/last-modified.txt
2024-08-16 18:51:41.028832115 +0800
chengzhu@DESKTOP-TPDC2FU:/tmp/missing$ cd
chengzhu@DESKTOP-TPDC2FU:~$ vim last-modified.txt
```



> 写一段命令来从 /sys 中获取笔记本的电量信息，或者台式机 CPU 的温度。

```bash
cat /sys/class/power_supply/BAT1/capacity
```