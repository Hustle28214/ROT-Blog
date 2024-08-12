
## 1. Kubernetes能够解决什么问题？

容器化技术固然很方便，但再好的工具也会产生一些问题。

学习了容器化技术之后，这些棘手问题就产生了：

问题1：怎么解决当容器故障宕机时，启动另一个容器去替补的问题？
问题2：容器的访问是并发式不均匀的，访问量变大时，怎么横向扩展容器数量？

业界最知名的Docker给出了Swarm的自有解决方案，Swarm是一款容器编排软件，能够更合理地编排容器。Kubernetes也是这样的一款容器编排软件，其受欢迎程度位居业界第一。

## 2. Kubernetes是什么？

Kubernetes是一个用于大规模部署分布式应用的平台，管理一系列的主机或服务器，这些主机或者服务器称作Node节点，每个节点运行着相互独立的Pod，Pod是Kubernetes中可以部署的最小执行单元，是一个或者多个容器的集合。


Pod需要有上层设施管理，管理这些Pod的中心计算机被称作Control Plane/控制平面，控制平面通过控制专有的API与各个节点通信，实时监测节点的网络状态来平衡服务器的负载，或者临时下发指令来处理突发事件。一旦检测到Pod异常，Kubernetes会立即调用备用的容器（Replica Set,副本集合）来替换之。

连同控制平面，上述生态被称之为一个集群（Cluster），代表kubernetes管理的全部主机节点。



## 3. 配置一个kubernetes集群

1. 租一个服务器在其上部署
2. 使用minikube来学习k8s

minikube安装官方文档地址：[点我](https://kubernetes.io/docs/tutorials/hello-minikube/)

Windows x64版本下载：

管理员打开Windows Powershell，输入
```bash
New-Item -Path 'c:\' -Name 'minikube' -ItemType Directory -Force
Invoke-WebRequest -OutFile 'c:\minikube\minikube.exe' -Uri 'https://github.com/kubernetes/minikube/releases/latest/download/minikube-windows-amd64.exe' -UseBasicParsing

```
配置完成后输入

```bash
$oldPath = [Environment]::GetEnvironmentVariable('Path', [EnvironmentVariableTarget]::Machine)
if ($oldPath.Split(';') -inotcontains 'C:\minikube'){
  [Environment]::SetEnvironmentVariable('Path', $('{0};C:\minikube' -f $oldPath), [EnvironmentVariableTarget]::Machine)
}

```

有了minikube，只需要使用
```bash
minikube start//启动本地模拟集群
```

即可创建集群！
## 4. 部署k8s应用

定义一个yaml文件：有哪些Pod组成，哪些容器，网络配置等等。

### 4.1 yaml介绍

YAML是一个类似于JSON、XML的数据序列化语言，专门用来写配置文件，简洁而强大，强调以数据为中心，比JSON更加方便。

横向对比一下，写YAML只需要xxx:xxx，而不需要"xxx":"xxxx"这样的格式，比json更加简洁。它不需要添加大量的参数到命令行中，也可以创建比命令行更复杂的结构，更加容易使用，可以通过控制源头，跟踪每次操作。

它的语法规则主要有下：

1. 对大小写敏感
2. 使用缩进表示层级关系
3. 缩进不允许Tab,空格可以
4. 相同层级的元素左侧对齐即可，没有规定多少个空格才是第二/第三级。
5. ＃表示注释。
6. 用"---"表示文档开始，用“...”表示文档结束。

### 4.2 YAML的结构类型

#### 4.2.1 Maps类型
Maps是键值对，一对key:value键值对。
```yaml
apiVersion:apps/v1
kind:Pod
metadata:
     name:finance
```
#### 4.2.2 Lists类型
List为数组。
```
args
   -star
   -sky
   -glassy
```
#### 4.2.3 混合类型

此处以一个yaml文件为例。

```
---
apiVersion:v1
kind:Pod
metadata:
     name:kkk
     labels:
        app:web
spec:
   containers:
       - name:front
         image:nginx
         ports:
          -containerPort:80
...          
```

containers可以设置的类型：
```
name
image
command
args
workingDir
ports
env
resources
volumeMounts
livenessProbe
readinessProbe
livecycle
terminationMessagePath
imagePullPolicy
securityContext
stdin
stdinOnce
tty
```


### 4.3 使用kubectl与kubernetes集群进行交互

打开命令行，使用kubectl apply部署应用：
```
kubectl apply -f deployment.yaml
```

通过kubectl get pods查看所有pod的运行状态：

```
kubectl get pods
```



### 4.4 更新应用

修改yaml文件，再次调用kubectl apply，kubernetes即会后台自动更新应用，确保新版本建立完成再销毁旧版本。