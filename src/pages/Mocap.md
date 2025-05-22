## 1. Mocap 项目整体架构

### 1.1 模块划分

Mocap 项目主要包含以下模块：

1. amc_parser: 负责解析amc文件
2. g1_retarget: 动作重定向的核心框架代码
3. robot_ik: 重定向优化的核心
4. rotation: 旋转
5. weighted_moving_filter: 权重滤波
6. 3Dviewer: 3D可视化，主要是处理关节位姿，发布关节TF数据
7. replay：回放

SMPL概念的提出：https://arxiv.org/abs/1803.04758

重定向的流程：

AMC+ASF=骨骼动画。其中ASF是骨骼，AMC是动画。在本项目中，ASF是通过``amc_parser.py``解析得到的。``parse_asf()``是主要解析方法。

BVH和SMPL(.npz和.pkl文件)都是骨骼+动画，比较核心的区别是精度。SMPL的精度更高，可以说是一个统计模型，它可以控制高矮胖瘦等等，相比之下BVH只重视了骨骼信息。在这个项目中没有使用精度很高的SMPL，而是使用了骨骼(bone)，后续如果考虑使用SMPL重定向到G1的话，需要考虑精度这一层怎么转换。

SMPL拥有6890 个网格顶点，形状参数10个，姿态参数24*3=72个。SMPL和BVH模型的向上轴为Y轴。

SMPL和BVH互转的核心（SMPL/SMPLX标准关节名，需与BVH关节名严格匹配）：

BVH → SMPL转换

1. 将BVH关节对应到SMPL的23个关节点+1个根节点上

2. 欧拉角 → 轴角（需处理万向节锁问题）

3. 调整根节点位移匹配SMPL坐标系

SMPL → BVH转换

1. 从SMPL的关节计算旋转矩阵

2. SMPL的轴角 → 四元数 → BVH的ZYX欧拉角

3. 结合原始骨骼位移生成新BVH

### 1.2 模块依赖关系

创建新的虚拟环境：

```shell
conda create -n mocap python=3.8 
conda activate mocap
```

安装依赖包：

```shell
pip install numpy transforms3d matplotlib pygame meshcat
conda install -c conda-forge pyyaml rospkg casadi # 可以换Pip安装
conda install pinocchio=3.1.0 -c conda-forge # 可能下载太慢，可换用pip install pin
```

外部模块写了是必须依赖```pinocchio==3.1.0```，但是实际上指的是3.1.0+，查阅源码后发现依赖的子模块还是在的。

CMAKE version：4.0.0

### 1.3 模块详细功能

amc_parser:

```python
import numpy as np
import matplotlib.pyplot as plt
from transforms3d.euler import euler2mat
from mpl_toolkits.mplot3d import Axes3D


class Joint:
  def __init__(self, name, direction, length, axis, dof, limits):
    """
    Definition of basic joint. The joint also contains the information of the
    bone between it's parent joint and itself. Refer
    [here](https://research.cs.wisc.edu/graphics/Courses/cs-838-1999/Jeff/ASF-AMC.html)
    for detailed description for asf files.

    Parameter
    ---------
    name: Name of the joint defined in the asf file. There should always be one
    root joint. String.

    direction: Default direction of the joint(bone). The motions are all defined
    based on this default pose.

    length: Length of the bone.

    axis: Axis of rotation for the bone.

    dof: Degree of freedom. Specifies the number of motion channels and in what
    order they appear in the AMC file.

    limits: Limits on each of the channels in the dof specification

    """
    self.name = name
    self.direction = np.reshape(direction, [3, 1])
    self.length = length
    axis = np.deg2rad(axis)
    self.C = euler2mat(*axis)
    self.Cinv = np.linalg.inv(self.C)
    self.limits = np.zeros([3, 2])
    for lm, nm in zip(limits, dof):
      if nm == 'rx':
        self.limits[0] = lm
      elif nm == 'ry':
        self.limits[1] = lm
      else:
        self.limits[2] = lm
    self.parent = None
    self.children = []
    self.coordinate = None
    self.matrix = None

  def set_motion(self, motion):
    if self.name == 'root':
      self.coordinate = np.reshape(np.array(motion['root'][:3]), [3, 1])
      rotation = np.deg2rad(motion['root'][3:])
      self.matrix = self.C.dot(euler2mat(*rotation)).dot(self.Cinv)
    else:
      idx = 0
      rotation = np.zeros(3)
      for axis, lm in enumerate(self.limits):
        if not np.array_equal(lm, np.zeros(2)):
          rotation[axis] = motion[self.name][idx]
          idx += 1
      rotation = np.deg2rad(rotation)
      self.matrix = self.parent.matrix.dot(self.C).dot(euler2mat(*rotation)).dot(self.Cinv)
      self.coordinate = self.parent.coordinate + self.length * self.matrix.dot(self.direction)
    for child in self.children:
      child.set_motion(motion)

  def draw(self):
    joints = self.to_dict()
    fig = plt.figure()
    ax = Axes3D(fig,auto_add_to_figure=False)
    fig.add_axes(ax)

    ax.set_xlim3d(-50, 10)
    ax.set_ylim3d(-20, 40)
    ax.set_zlim3d(-20, 40)

    xs, ys, zs = [], [], []
    for joint in joints.values():
      xs.append(joint.coordinate[0, 0])
      ys.append(joint.coordinate[1, 0])
      zs.append(joint.coordinate[2, 0])
    plt.plot(zs, xs, ys, 'b.')

    for joint in joints.values():
      child = joint
      if child.parent is not None:
        parent = child.parent
        xs = [child.coordinate[0, 0], parent.coordinate[0, 0]]
        ys = [child.coordinate[1, 0], parent.coordinate[1, 0]]
        zs = [child.coordinate[2, 0], parent.coordinate[2, 0]]
        plt.plot(zs, xs, ys, 'r')
    plt.show()

  def to_dict(self):
    ret = {self.name: self}
    for child in self.children:
      ret.update(child.to_dict())
    return ret

  def pretty_print(self):
    print('===================================')
    print('joint: %s' % self.name)
    print('direction:')
    print(self.direction)
    print('limits:', self.limits)
    print('parent:', self.parent)
    print('children:', self.children)


def read_line(stream, idx):
  if idx >= len(stream):
    return None, idx
  line = stream[idx].strip().split()
  idx += 1
  return line, idx


def parse_asf(file_path):
  '''read joint data only'''
  with open(file_path) as f:
    content = f.read().splitlines()

  for idx, line in enumerate(content):
    # meta infomation is ignored
    if line == ':bonedata':
      content = content[idx+1:]
      break

  # read joints
  joints = {'root': Joint('root', np.zeros(3), 0, np.zeros(3), [], [])}
  idx = 0
  while True:
    # the order of each section is hard-coded

    line, idx = read_line(content, idx)

    if line[0] == ':hierarchy':
      break

    assert line[0] == 'begin'

    line, idx = read_line(content, idx)
    assert line[0] == 'id'

    line, idx = read_line(content, idx)
    assert line[0] == 'name'
    name = line[1]

    line, idx = read_line(content, idx)
    assert line[0] == 'direction'
    direction = np.array([float(axis) for axis in line[1:]])

    # skip length
    line, idx = read_line(content, idx)
    assert line[0] == 'length'
    length = float(line[1])

    line, idx = read_line(content, idx)
    assert line[0] == 'axis'
    assert line[4] == 'XYZ'

    axis = np.array([float(axis) for axis in line[1:-1]])

    dof = []
    limits = []

    line, idx = read_line(content, idx)
    if line[0] == 'dof':
      dof = line[1:]
      for i in range(len(dof)):
        line, idx = read_line(content, idx)
        if i == 0:
          assert line[0] == 'limits'
          line = line[1:]
        assert len(line) == 2
        mini = float(line[0][1:])
        maxi = float(line[1][:-1])
        limits.append((mini, maxi))

      line, idx = read_line(content, idx)

    assert line[0] == 'end'
    joints[name] = Joint(
      name,
      direction,
      length,
      axis,
      dof,
      limits
    )

  # read hierarchy
  assert line[0] == ':hierarchy'

  line, idx = read_line(content, idx)

  assert line[0] == 'begin'

  while True:
    line, idx = read_line(content, idx)
    if line[0] == 'end':
      break
    assert len(line) >= 2
    for joint_name in line[1:]:
      joints[line[0]].children.append(joints[joint_name])
    for nm in line[1:]:
      joints[nm].parent = joints[line[0]]

  return joints


def parse_amc(file_path):
  with open(file_path) as f:
    content = f.read().splitlines()

  for idx, line in enumerate(content):
    if line == ':DEGREES':
      content = content[idx+1:]
      break

  frames = []
  idx = 0
  line, idx = read_line(content, idx)
  assert line[0].isnumeric(), line
  EOF = False
  while not EOF:
    joint_degree = {}
    while True:
      line, idx = read_line(content, idx)
      if line is None:
        EOF = True
        break
      if line[0].isnumeric():
        break
      joint_degree[line[0]] = [float(deg) for deg in line[1:]]
    frames.append(joint_degree)
  return frames


def test_all():
  import os
  lv0 = './data'
  lv1s = os.listdir(lv0)
  for lv1 in lv1s:
    lv2s = os.listdir('/'.join([lv0, lv1]))
    asf_path = '%s/%s/%s.asf' % (lv0, lv1, lv1)
    print('parsing %s' % asf_path)
    joints = parse_asf(asf_path)
    motions = parse_amc('./nopose.amc')
    joints['root'].set_motion(motions[0])
    joints['root'].draw()

    # for lv2 in lv2s:
    #   if lv2.split('.')[-1] != 'amc':
    #     continue
    #   amc_path = '%s/%s/%s' % (lv0, lv1, lv2)
    #   print('parsing amc %s' % amc_path)
    #   motions = parse_amc(amc_path)
    #   for idx, motion in enumerate(motions):
    #     print('setting motion %d' % idx)
    #     joints['root'].set_motion(motion)


if __name__ == '__main__':
  test_all()
  # asf_path = './133.asf'
  # amc_path = './133_01.amc'
  # joints = parse_asf(asf_path)
  # motions = parse_amc(amc_path)
  # frame_idx = 0
  # joints['root'].set_motion(motions[frame_idx])
  # joints['root'].draw()
```

asf是骨骼文件，amc是动作文件，asf文件实则是拼接起来的，这个脚本就负责了asf文件的拼接。

每个关节的默认方向（direction）和骨骼长度（length）定义了其在初始姿势下的位置。关节的旋转轴（axis）通过欧拉角转换为旋转矩阵C，并存储其逆矩阵Cinv，用于后续坐标变换。每个关节的旋转自由度（dof）及角度限制（limits）决定其在运动时的可活动范围。通过:hierarchy部分建立父子关系，父关节的children列表添加子关节，子关节的parent属性指向父关节，形成树状结构。

根关节：直接设置全局坐标和旋转，其变换矩阵由初始旋转矩阵与运动数据中的欧拉角计算得出。

子关节：继承父关节的变换矩阵，叠加自身的旋转矩阵（受dof和limits约束），计算局部坐标后转换为全局坐标。子关节坐标 = 父关节坐标 + 长度 × (父变换矩阵 × 自身旋转矩阵 × 初始方向向量)

g1_retarget:

```python
#!/usr/bin/env python
import rospy
from geometry_msgs.msg import PoseStamped
import numpy as np
from scipy.spatial.transform import Rotation as Rot
from sensor_msgs.msg import JointState
from robot_ik import *
# import pinocchio as pin
import tf
import csv
import os
from std_msgs.msg import Int32

def rotx(theta):
    theta = np.radians(theta) 
    Rx = np.array([[1, 0, 0],
               [0, np.cos(theta), -np.sin(theta)],
               [0, np.sin(theta), np.cos(theta)]])
    return Rx

def roty(theta):
    theta = np.radians(theta) 
    Ry = np.array([[np.cos(theta), 0, np.sin(theta)],
               [0, 1, 0],
               [-np.sin(theta), 0, np.cos(theta)]])
    return Ry

def rotz(theta):
    theta = np.radians(theta)
    Rz = np.array([[np.cos(theta), -np.sin(theta), 0],
               [np.sin(theta), np.cos(theta), 0],
               [0, 0, 1]])
    return Rz


class FramePoseSub:
    def __init__(self):
        # initial positon
        rospy.init_node('g1_retarget', anonymous=True)
        self.subscriber = rospy.Subscriber('/frame_num', Int32, self.frameNumcallback)
        self.lhand_target = pin.SE3(
            pin.Quaternion(1, 0, 0, 0),
            np.array([0.25, +0.25, 0.3]),
        )
        self.rhand_target = pin.SE3(
            pin.Quaternion(1, 0, 0, 0),
            np.array([0.25, -0.25, 0.3]),
        )
        self.lfoot_target = pin.SE3(
            pin.Quaternion(1, 0, 0, 0),
            np.array([0, 0.15, -0.80]),
        )
        self.rfoot_target = pin.SE3(
            pin.Quaternion(1, 0, 0, 0),
            np.array([0, -0.15, -0.80]),
        )
        self.head_target = pin.SE3(
            pin.Quaternion(1, 0, 0, 0),
            np.array([0, 0, 0.25]),
        )
        self.root_target = pin.SE3(
            pin.Quaternion(1, 0, 0, 0),
            np.array([0, 0, 0]),
        )
        self.lelbow_target = pin.SE3(
            pin.Quaternion(1, 0, 0, 0),
            np.array([0, 0, 0.25]),
        )
        self.relbow_target = pin.SE3(
            pin.Quaternion(1, 0, 0, 0),
            np.array([0, 0, 0.25]),
        )
        self.g1_joint_names = ['left_hip_pitch_joint', 'left_hip_roll_joint', 'left_hip_yaw_joint', \
                    'left_knee_joint', 'left_ankle_pitch_joint', 'left_ankle_roll_joint', \
                    'right_hip_pitch_joint', 'right_hip_roll_joint', 'right_hip_yaw_joint', \
                    'right_knee_joint', 'right_ankle_pitch_joint', 'right_ankle_roll_joint', \
                    'waist_yaw_joint', 'waist_roll_joint', 'waist_pitch_joint', \
                    'left_shoulder_pitch_joint', 'left_shoulder_roll_joint', 'left_shoulder_yaw_joint', \
                    'left_elbow_joint', 'left_wrist_roll_joint', 'left_wrist_pitch_joint', 'left_wrist_yaw_joint', \
                    'right_shoulder_pitch_joint', 'right_shoulder_roll_joint', 'right_shoulder_yaw_joint', \
                    'right_elbow_joint', 'right_wrist_roll_joint', 'right_wrist_pitch_joint', 'right_wrist_yaw_joint'
                    ]

        self.frame_num = 0

    def frameNumcallback(self, data):
        self.frame_num = data.data

    def joint_publisher(self):
        self.joint_pub = rospy.Publisher('g1_joint_states', JointState, queue_size=10)

if __name__ == "__main__":
    render = rospy.get_param('render', True)
    outputdata = rospy.get_param('OutputData', True)

    framesub = FramePoseSub()
    framesub.joint_publisher()
    rate = rospy.Rate(1000)  # 1000 Hz
    urdf_path = "../g1_description/urdf/g1.urdf" 
    fps = rospy.get_param('motion_fps', 12)
    human_tf = tf.TransformListener()
    data = []
    timestamp = 0.0
    robot_ik = RobotIK(Visualization = render, fps=fps)
    last_frame = 0
    sol_q_last = np.zeros(35)
    sol_q_last[6] = -0.1
    sol_q_last[9] = 0.3
    sol_q_last[10] = -0.2
    sol_q_last[12] = -0.1
    sol_q_last[15] = 0.3
    sol_q_last[16] = -0.2
    start_time = rospy.Time.now().to_sec()
    newest_frame = 1
    rospy.sleep(1)
    while not rospy.is_shutdown():

        (trans, rot) = human_tf.lookupTransform('/world', '/lhand', rospy.Time(0))
        framesub.lhand_target.translation = np.array([trans[0], trans[1], trans[2]])
        quat = np.array([rot[0], rot[1], rot[2], rot[3]])
        rotMat = Rot.from_quat(quat)
        framesub.lhand_target.rotation = rotMat.as_matrix() @ rotx(90) @ roty(-90)

        (trans, rot) = human_tf.lookupTransform('/world', '/rhand', rospy.Time(0))
        framesub.rhand_target.translation = np.array([trans[0], trans[1], trans[2]])
        quat = np.array([rot[0], rot[1], rot[2], rot[3]])
        rotMat = Rot.from_quat(quat)
        framesub.rhand_target.rotation = rotMat.as_matrix() @ rotx(-90) @ roty(90)

        (trans, rot) = human_tf.lookupTransform('/world', '/lfoot', rospy.Time(0))
        framesub.lfoot_target.translation = np.array([trans[0], trans[1], trans[2]])
        quat = np.array([rot[0], rot[1], rot[2], rot[3]])
        rotMat = Rot.from_quat(quat)
        framesub.lfoot_target.rotation = rotMat.as_matrix() @ rotz(-90)

        (trans, rot) = human_tf.lookupTransform('/world', '/rfoot', rospy.Time(0))
        framesub.rfoot_target.translation = np.array([trans[0], trans[1], trans[2]])
        quat = np.array([rot[0], rot[1], rot[2], rot[3]])
        rotMat = Rot.from_quat(quat)
        framesub.rfoot_target.rotation = rotMat.as_matrix() @ rotz(-90)

        (trans, rot) = human_tf.lookupTransform('/world', '/root', rospy.Time(0))
        framesub.root_target.translation = np.array([trans[0], trans[1], trans[2]])
        quat = np.array([rot[0], rot[1], rot[2], rot[3]])
        rotMat = Rot.from_quat(quat)
        framesub.root_target.rotation = rotMat.as_matrix() @ roty(-12)

        (trans, rot) = human_tf.lookupTransform('/world', '/lowerneck', rospy.Time(0))
        framesub.head_target.translation = np.array([trans[0], trans[1], trans[2]])
        quat = np.array([rot[0], rot[1], rot[2], rot[3]])
        rotMat = Rot.from_quat(quat)
        framesub.head_target.rotation = rotMat.as_matrix() @ rotz(-90) @ roty(-90) @ roty(20)

        (trans, rot) = human_tf.lookupTransform('/world', '/lradius', rospy.Time(0))
        framesub.lelbow_target.translation = np.array([trans[0], trans[1], trans[2]])
        quat = np.array([rot[0], rot[1], rot[2], rot[3]])
        rotMat = Rot.from_quat(quat)
        framesub.lelbow_target.rotation = rotMat.as_matrix() @ rotz(-90) @ rotx(180)

        (trans, rot) = human_tf.lookupTransform('/world', '/rradius', rospy.Time(0))
        framesub.relbow_target.translation = np.array([trans[0], trans[1], trans[2]])
        quat = np.array([rot[0], rot[1], rot[2], rot[3]])
        rotMat = Rot.from_quat(quat)
        framesub.relbow_target.rotation = rotMat.as_matrix() @ rotz(-90) @ rotx(180)

        timestamp = rospy.Time.now().to_sec() - start_time

        sol_q = robot_ik.solve_ik(framesub.lhand_target.homogeneous,
                                framesub.rhand_target.homogeneous,
                                framesub.lfoot_target.homogeneous,
                                framesub.rfoot_target.homogeneous,
                                framesub.root_target.homogeneous,
                                framesub.head_target.homogeneous,
                                framesub.lelbow_target.homogeneous,
                                framesub.relbow_target.homogeneous,
                                current_lr_arm_motor_q=sol_q_last
                                )

        sol_q_last = sol_q

        if(framesub.frame_num >= newest_frame):
            newest_frame = framesub.frame_num

        if(framesub.frame_num > last_frame):
            if(framesub.frame_num > (last_frame + 1)):
                rospy.loginfo("fps is too high! skip %d frames at %d", framesub.frame_num - last_frame - 1, last_frame)

            time_sol_q = np.insert(sol_q, 0, timestamp)
            frame_time_sol_q = np.insert(time_sol_q, 0, framesub.frame_num)
            if(framesub.frame_num >= newest_frame):
                data.append(frame_time_sol_q)

        last_frame = framesub.frame_num
        rate.sleep()

    if(outputdata):
        script_directory = os.path.dirname(os.path.abspath(__file__))
        output_directory = os.path.join(script_directory, 'data')
        if not os.path.exists(output_directory):
            os.makedirs(output_directory)
        file_path = os.path.join(output_directory, 'output.csv')

        with open(file_path, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['frame','timestamp','posX','posY','posZ','roll','pitch','yaw'] + framesub.g1_joint_names)
            for arr in data:
                writer.writerow(arr)

        print("CSV FILE OUTPUT COMPLETE!")
```

这里是重定向的框架部分，我们可以看到这里也是做了旋转处理，优化方面还是调用ik（Inverse Kinematics，简称IK，也就是机器人学中指的逆解）脚本。

首先订阅3DViewer的TF话题，获取骨骼关键点；然后调用IK脚本，计算关节角度；最后发布G1的关节角度。

所以重定向技术的核心还是robot_ik模块。

robot_ik：

```python
#!/usr/bin/env python3
import casadi                                                                       
import meshcat.geometry as mg
import numpy as np
import pinocchio as pin                             
import time
from pinocchio import casadi as cpin                
from pinocchio.robot_wrapper import RobotWrapper
from pinocchio.visualize import MeshcatVisualizer
import os
import sys

parent2_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(parent2_dir)

from weighted_moving_filter import WeightedMovingFilter



class RobotIK:
    def __init__(self, Visualization = False, fps=120):
        np.set_printoptions(precision=5, suppress=True, linewidth=200)

        self.Visualization = Visualization
        self.fps = fps
        self.joint_model = pin.JointModelComposite()
        # 添加 3 个平移自由度
        self.joint_model.addJoint(pin.JointModelTranslation())

        # 添加 3 个旋转自由度 (roll, pitch, yaw)
        self.joint_model.addJoint(pin.JointModelRX())  # Roll
        self.joint_model.addJoint(pin.JointModelRY())  # Pitch
        self.joint_model.addJoint(pin.JointModelRZ())  # Yaw

        current_path = os.path.dirname(os.path.abspath(__file__))
        urdf_path = os.path.join(current_path, '../../g1_description/urdf', 'g1.urdf')
        urdf_dirs = os.path.join(current_path, '../../g1_description/urdf')
        self.robot = pin.RobotWrapper.BuildFromURDF(urdf_path,
                                                    root_joint = self.joint_model,
                                                    package_dirs = urdf_dirs)

        self.mixed_jointsToLockIDs =[]
        self.reduced_robot = self.robot.buildReducedRobot(
            list_of_joints_to_lock=self.mixed_jointsToLockIDs,
            reference_configuration=np.array([0.0] * self.robot.model.nq),
        )

        # self.reduced_robot.model.addFrame(
        #     pin.Frame('L_ee',
        #               self.reduced_robot.model.getJointId('left_wrist_yaw_joint'),
        #               pin.SE3(np.eye(3),
        #                       np.array([0.05,0,0]).T),
        #               pin.FrameType.OP_FRAME)
        # )

        # self.reduced_robot.model.addFrame(
        #     pin.Frame('R_ee',
        #               self.reduced_robot.model.getJointId('right_wrist_yaw_joint'),
        #               pin.SE3(np.eye(3),
        #                       np.array([0.05,0,0]).T),
        #               pin.FrameType.OP_FRAME)
        # )

        # for i in range(self.reduced_robot.model.nframes):
        #     frame = self.reduced_robot.model.frames[i]
        #     frame_id = self.reduced_robot.model.getFrameId(frame.name)
        #     print(f"Frame ID: {frame_id}, Name: {frame.name}")


        # Creating Casadi models and data for symbolic computing
        self.cmodel = cpin.Model(self.reduced_robot.model)
        self.cdata = self.cmodel.createData()

        # Creating symbolic variables
        self.cq = casadi.SX.sym("q", self.reduced_robot.model.nq, 1)
        self.cTf_lhand = casadi.SX.sym("tf_lhand", 4, 4)
        self.cTf_rhand = casadi.SX.sym("tf_rhand", 4, 4)
        self.cTf_root = casadi.SX.sym("tf_root", 4, 4)
        self.cTf_lfoot = casadi.SX.sym("tf_lfoot", 4, 4)
        self.cTf_rfoot = casadi.SX.sym("tf_rfoot", 4, 4)
        self.cTf_head = casadi.SX.sym("tf_head", 4, 4)
        self.cTf_lelbow = casadi.SX.sym("cTf_lelbow", 4, 4)
        self.cTf_relbow = casadi.SX.sym("cTf_relbow", 4, 4)
        cpin.framesForwardKinematics(self.cmodel, self.cdata, self.cq)

        # Get the hand joint ID and define the error function
        self.lhand_id = self.reduced_robot.model.getFrameId("left_wrist_yaw_link")
        self.rhand_id = self.reduced_robot.model.getFrameId("right_wrist_yaw_link")
        self.root_id = self.reduced_robot.model.getFrameId("pelvis") # root_sphere
        self.head_id = self.reduced_robot.model.getFrameId("head_sphere")
        self.lfoot_id = self.reduced_robot.model.getFrameId("left_ankle_roll_link")
        self.rfoot_id = self.reduced_robot.model.getFrameId("right_ankle_roll_link")
        self.lelbow_id = self.reduced_robot.model.getFrameId("left_elbow_link")
        self.relbow_id = self.reduced_robot.model.getFrameId("right_elbow_link")
        self.lelbow_coll_id = self.reduced_robot.model.getFrameId("left_elbow_cllision_link")
        self.relbow_coll_id = self.reduced_robot.model.getFrameId("right_elbow_cllision_link")

        self.translational_error = casadi.Function(
            "translational_error",
            [self.cq, self.cTf_lhand, self.cTf_rhand, self.cTf_root, self.cTf_lfoot, self.cTf_rfoot, self.cTf_lelbow, self.cTf_relbow],
            [
                casadi.vertcat(
                    self.cdata.oMf[self.lhand_id].translation - self.cTf_lhand[:3,3],
                    self.cdata.oMf[self.rhand_id].translation - self.cTf_rhand[:3,3],
                    self.cdata.oMf[self.root_id].translation - self.cTf_root[:3,3],
                    self.cdata.oMf[self.lfoot_id].translation - self.cTf_lfoot[:3,3],
                    self.cdata.oMf[self.rfoot_id].translation - self.cTf_rfoot[:3,3],
                    self.cdata.oMf[self.lelbow_id].translation - self.cTf_lelbow[:3,3],
                    self.cdata.oMf[self.relbow_id].translation - self.cTf_relbow[:3,3],
                )
            ],
        )
        self.rotational_error = casadi.Function(
            "rotational_error",
            [self.cq, self.cTf_lhand, self.cTf_rhand, self.cTf_root, self.cTf_lfoot, self.cTf_rfoot, self.cTf_head],
            [
                casadi.vertcat(

                    cpin.log3(self.cTf_lhand[:3,:3] @ self.cdata.oMf[self.lhand_id].rotation.T),
                    cpin.log3(self.cTf_rhand[:3,:3] @ self.cdata.oMf[self.rhand_id].rotation.T),
                    cpin.log3(self.cTf_root[:3,:3] @ self.cdata.oMf[self.root_id].rotation.T),
                    cpin.log3(self.cTf_lfoot[:3,:3] @ self.cdata.oMf[self.lfoot_id].rotation.T),
                    cpin.log3(self.cTf_rfoot[:3,:3] @ self.cdata.oMf[self.rfoot_id].rotation.T),
                    cpin.log3(self.cTf_head[:3,:3] @ self.cdata.oMf[self.head_id].rotation.T)
                )
            ],
        )

        self.left_elbow_collision_avoid = casadi.Function(
            "left_elbow_collision_avoid",
            [self.cq],
            [
                casadi.fmax(
                    0.015 - 
                    casadi.sumsqr(
                    self.cdata.oMf[self.lelbow_id].translation - self.cdata.oMf[self.lelbow_coll_id].translation
                    ),
                    0
                )
            ],
        )

        self.right_elbow_collision_avoid = casadi.Function(
            "right_elbow_collision_avoid",
            [self.cq],
            [
                casadi.fmax(
                    0.015 - 
                    casadi.sumsqr(
                    self.cdata.oMf[self.relbow_id].translation - self.cdata.oMf[self.relbow_coll_id].translation
                    ),
                    0.0
                )
            ],
        )

        # Defining the optimization problem
        self.opti = casadi.Opti()
        self.var_q = self.opti.variable(self.reduced_robot.model.nq)
        self.var_q_last = self.opti.parameter(self.reduced_robot.model.nq)   # for smooth
        self.param_tf_lhand = self.opti.parameter(4, 4)
        self.param_tf_rhand = self.opti.parameter(4, 4)
        self.param_tf_root = self.opti.parameter(4, 4)
        self.param_tf_lfoot = self.opti.parameter(4, 4)
        self.param_tf_rfoot = self.opti.parameter(4, 4)
        self.param_tf_head = self.opti.parameter(4, 4)
        self.param_tf_lelbow = self.opti.parameter(4, 4)
        self.param_tf_relbow = self.opti.parameter(4, 4)
        self.translational_cost = casadi.sumsqr(self.translational_error(self.var_q, self.param_tf_lhand, self.param_tf_rhand, self.param_tf_root, self.param_tf_lfoot, self.param_tf_rfoot, self.param_tf_lelbow, self.param_tf_relbow))
        self.rotation_cost = casadi.sumsqr(self.rotational_error(self.var_q, self.param_tf_lhand, self.param_tf_rhand, self.param_tf_root, self.param_tf_lfoot, self.param_tf_rfoot,self.param_tf_head))
        self.regularization_cost = casadi.sumsqr(self.var_q)
        self.smooth_cost = casadi.sumsqr(self.var_q - self.var_q_last)
        # self.collision_cost = self.left_elbow_collision_avoid(self.var_q) + self.right_elbow_collision_avoid(self.var_q)

        # Setting optimization constraints and goals
        self.opti.subject_to(self.opti.bounded(
            self.reduced_robot.model.lowerPositionLimit,
            self.var_q,
            self.reduced_robot.model.upperPositionLimit)
        )
        self.opti.minimize(50 * self.translational_cost 
                           + self.rotation_cost 
                           + 0.02 * self.regularization_cost 
                           + 0.1 * self.smooth_cost
                            # + 0.6 * self.collision_cost
                           )

        opts = {
            'ipopt':{
                'print_level':0,
                'max_iter':50, # 50
                'tol':1e-3
            },
            'print_time':False,# print or not
            'calc_lam_p':False 
            # https://github.com/casadi/casadi/wiki/FAQ:-Why-am-I-getting-%22NaN-detected%22in-my-optimization%3F
        }
        self.opti.solver("ipopt", opts)

        self.init_qdata = np.zeros(self.reduced_robot.model.nq)
        self.last_qdata = np.zeros(self.reduced_robot.model.nq)
        self.smooth_filter = WeightedMovingFilter(np.array([0.4, 0.3, 0.2, 0.1]), self.reduced_robot.model.nq)
        self.vis = None

        if self.Visualization:
            # Initialize the Meshcat visualizer for visualization
            self.vis = MeshcatVisualizer(self.reduced_robot.model, self.reduced_robot.collision_model, self.reduced_robot.visual_model)
            self.vis.initViewer(open=True) 
            self.vis.loadViewerModel("pinocchio") 
            self.vis.displayFrames(True, frame_ids=[101, 102], axis_length = 0.15, axis_width = 5)
            self.vis.display(pin.neutral(self.reduced_robot.model))

            # Enable the display of end effector target frames with short axis lengths and greater width.
            frame_viz_names = ['lhand_target', 'rhand_target', 'lfoot_target', 'rfoot_target', 'root_target', 'head_target', 'lelbow_target', 'relbow_target']
            FRAME_AXIS_POSITIONS = (
                np.array([[0, 0, 0], [1, 0, 0],
                          [0, 0, 0], [0, 1, 0],
                          [0, 0, 0], [0, 0, 1]]).astype(np.float32).T
            )
            FRAME_AXIS_COLORS = (
                np.array([[1, 0, 0], [1, 0.6, 0],
                          [0, 1, 0], [0.6, 1, 0],
                          [0, 0, 1], [0, 0.6, 1]]).astype(np.float32).T
            )
            axis_length = 0.1
            axis_width = 10
            for frame_viz_name in frame_viz_names:
                self.vis.viewer[frame_viz_name].set_object(
                    mg.LineSegments(
                        mg.PointsGeometry(
                            position=axis_length * FRAME_AXIS_POSITIONS,
                            color=FRAME_AXIS_COLORS,
                        ),
                        mg.LineBasicMaterial(
                            linewidth=axis_width,
                            vertexColors=True,
                        ),
                    )
                )
    # If the robot arm is not the same size as your arm :)
    def scale_lengths(self, 
                      human_lhand_pose, human_rhand_pose, 
                      human_lfoot_pose, human_rfoot_pose, 
                      robot_root_pose, 
                      robot_head_pose, 
                      human_lelbow_pose, human_relbow_pose,
                      human_arm_length=0.784, robot_arm_length=0.50,
                      human_leg_length=0.95, robot_leg_length=0.65,
                      human_elbow_length=0.784, robot_elbow_length=0.5):
        arm_scale_factor = robot_arm_length / human_arm_length
        elbow_scale_factor = robot_elbow_length / human_elbow_length
        robot_lhand_pose = human_lhand_pose.copy()
        robot_rhand_pose = human_rhand_pose.copy()
        robot_lhand_pose[:3, 3] = robot_head_pose[:3, 3] + arm_scale_factor * (robot_lhand_pose[:3, 3] - robot_head_pose[:3, 3])
        robot_rhand_pose[:3, 3] = robot_head_pose[:3, 3] + arm_scale_factor * (robot_rhand_pose[:3, 3] - robot_head_pose[:3, 3])

        robot_lelbow_pose = human_lelbow_pose.copy()
        robot_relbow_pose = human_relbow_pose.copy()
        robot_lelbow_pose[:3, 3] = robot_head_pose[:3, 3] + elbow_scale_factor * (robot_lelbow_pose[:3, 3] - robot_head_pose[:3, 3])
        robot_relbow_pose[:3, 3] = robot_head_pose[:3, 3] + elbow_scale_factor * (robot_relbow_pose[:3, 3] - robot_head_pose[:3, 3])

        # avoid elbow collsion 
        diff_norm_lelbow = np.linalg.norm(self.reduced_robot.data.oMf[self.lelbow_coll_id].translation - robot_lelbow_pose[:3, 3]) 
        apart_direction = robot_lelbow_pose[:3, 3] - self.reduced_robot.data.oMf[self.lelbow_coll_id].translation
        norm_apart_direction = apart_direction / np.linalg.norm(apart_direction)
        robot_lelbow_pose[:3, 3] += norm_apart_direction * max(0.0, (0.12 - diff_norm_lelbow))
        diff_norm_lelbow = np.linalg.norm(self.reduced_robot.data.oMf[self.lelbow_coll_id].translation - robot_lelbow_pose[:3, 3])

        diff_norm_relbow = np.linalg.norm(self.reduced_robot.data.oMf[self.relbow_coll_id].translation - robot_relbow_pose[:3, 3])     
        apart_direction = robot_relbow_pose[:3, 3] - self.reduced_robot.data.oMf[self.relbow_coll_id].translation
        norm_apart_direction = apart_direction / np.linalg.norm(apart_direction)
        robot_relbow_pose[:3, 3] += norm_apart_direction * max(0.0, (0.12 - diff_norm_relbow))
        diff_norm_relbow = np.linalg.norm(self.reduced_robot.data.oMf[self.relbow_coll_id].translation - robot_relbow_pose[:3, 3])

        leg_scale_factor = robot_leg_length / human_leg_length
        robot_lfoot_pose = human_lfoot_pose.copy()
        robot_rfoot_pose = human_rfoot_pose.copy()
        robot_lfoot_pose[:3, 3] = robot_root_pose[:3, 3] + leg_scale_factor * (robot_lfoot_pose[:3, 3] - robot_root_pose[:3, 3])
        robot_rfoot_pose[:3, 3] = robot_root_pose[:3, 3] + leg_scale_factor * (robot_rfoot_pose[:3, 3] - robot_root_pose[:3, 3])

        # avoid foot collsion
        foot_clearence_min = 0.15
        diff_norm_foot = np.linalg.norm(robot_lfoot_pose[:3, 3] - robot_rfoot_pose[:3, 3]) 
        lfoot_apart_direction = robot_lfoot_pose[:3, 3] - robot_rfoot_pose[:3, 3]
        lfoot_norm_apart_direction = lfoot_apart_direction / np.linalg.norm(lfoot_apart_direction)
        rfoot_norm_apart_direction = -lfoot_norm_apart_direction

        vel_lfoot = np.linalg.norm(pin.getFrameVelocity(self.reduced_robot.model, self.reduced_robot.data, self.lfoot_id).linear)
        vel_rfoot = np.linalg.norm(pin.getFrameVelocity(self.reduced_robot.model, self.reduced_robot.data, self.rfoot_id).linear)

        if(vel_lfoot > 0.55):
            robot_lfoot_pose[:3, 3] += lfoot_norm_apart_direction * max(0.0, (foot_clearence_min - diff_norm_foot) *(vel_lfoot)/(vel_lfoot + vel_rfoot))
        if(vel_rfoot > 0.55):    
            robot_rfoot_pose[:3, 3] += rfoot_norm_apart_direction * max(0.0, (foot_clearence_min - diff_norm_foot) *(vel_rfoot)/(vel_lfoot + vel_rfoot))

        return robot_lhand_pose, robot_rhand_pose, robot_lfoot_pose, robot_rfoot_pose, robot_lelbow_pose, robot_relbow_pose

    def solve_ik(self, left_wrist, right_wrist, left_foot, right_foot, root, head, lelbow, relbow, current_lr_arm_motor_q = None, current_lr_arm_motor_dq = None):
        if current_lr_arm_motor_q is not None:
            self.init_qdata = current_lr_arm_motor_q
        self.opti.set_initial(self.var_q, self.init_qdata)

        dq = (self.init_qdata - self.last_qdata) / (1.0 / 120.)
        pin.framesForwardKinematics(self.reduced_robot.model, self.reduced_robot.data, self.init_qdata)
        pin.computeForwardKinematicsDerivatives(self.reduced_robot.model, self.reduced_robot.data, self.init_qdata, dq, np.zeros(self.reduced_robot.model.nv))

        left_wrist, right_wrist, left_foot, right_foot, lelbow, relbow = self.scale_lengths(left_wrist, right_wrist,
                                                                            left_foot, right_foot,
                                                                            root,
                                                                            head,
                                                                            lelbow,
                                                                            relbow)
        if self.Visualization:
            self.vis.viewer['lhand_target'].set_transform(left_wrist)   # for visualization
            self.vis.viewer['rhand_target'].set_transform(right_wrist)  # for visualization
            self.vis.viewer['lfoot_target'].set_transform(left_foot)   # for visualization
            self.vis.viewer['rfoot_target'].set_transform(right_foot)  # for visualization
            self.vis.viewer['root_target'].set_transform(root)  # for visualization
            self.vis.viewer['head_target'].set_transform(head)  # for visualization
            self.vis.viewer['lelbow_target'].set_transform(lelbow)  # for visualization
            self.vis.viewer['relbow_target'].set_transform(relbow)  # for visualization


        self.opti.set_value(self.param_tf_lhand, left_wrist)
        self.opti.set_value(self.param_tf_rhand, right_wrist)
        self.opti.set_value(self.param_tf_lelbow, lelbow)
        self.opti.set_value(self.param_tf_relbow, relbow)
        self.opti.set_value(self.param_tf_lfoot, left_foot)
        self.opti.set_value(self.param_tf_rfoot, right_foot)
        self.opti.set_value(self.param_tf_root, root)
        self.opti.set_value(self.param_tf_head, head)

        self.opti.set_value(self.var_q_last, self.init_qdata) # for smooth
        self.last_qdata = self.init_qdata
        try:
            sol = self.opti.solve()
            # sol = self.opti.solve_limited()

            sol_q = self.opti.value(self.var_q)
            self.smooth_filter.add_data(sol_q)
            sol_q = self.smooth_filter.filtered_data
            # print(sol_q)
            if current_lr_arm_motor_dq is not None:
                v = current_lr_arm_motor_dq * 0.0
            else:
                v = (sol_q - self.init_qdata) * 0.0

            self.init_qdata = sol_q

            # sol_tauff = pin.rnea(self.reduced_robot.model, self.reduced_robot.data, sol_q, v, np.zeros(self.reduced_robot.model.nv))

            if self.Visualization:
                self.vis.display(sol_q)  # for visualization

            return sol_q

        except Exception as e:
            print(f"ERROR in convergence, plotting debug info.{e}")

            sol_q = self.opti.debug.value(self.var_q)
            self.smooth_filter.add_data(sol_q)
            sol_q = self.smooth_filter.filtered_data

            if current_lr_arm_motor_dq is not None:
                v = current_lr_arm_motor_dq * 0.0
            else:
                v = (sol_q - self.init_qdata) * 0.0

            self.init_qdata = sol_q

            # sol_tauff = pin.rnea(self.reduced_robot.model, self.reduced_robot.data, sol_q, v, np.zeros(self.reduced_robot.model.nv))

            # print(f"sol_q:{sol_q} \nmotorstate: \n{current_lr_arm_motor_q} \nleft_pose: \n{left_wrist} \nright_pose: \n{right_wrist}")
            if self.Visualization:
                self.vis.display(sol_q)  # for visualization

            # return sol_q, sol_tauff
            return current_lr_arm_motor_q


if __name__ == "__main__":
    arm_ik = RobotIK(Visualization = True)

    # initial positon
    lhand_target = pin.SE3(
        pin.Quaternion(1, 0, 0, 0),
        np.array([0.25, +0.25, 0.3]),
    )

    rhand_target = pin.SE3(
        pin.Quaternion(1, 0, 0, 0),
        np.array([0.25, -0.25, 0.3]),
    )

    lfoot_target = pin.SE3(
        pin.Quaternion(1, 0, 0, 0),
        np.array([0, 0.15, -0.80]),
    )

    rfoot_target = pin.SE3(
        pin.Quaternion(1, 0, 0, 0),
        np.array([0, -0.15, -0.80]),
    )

    head_target = pin.SE3(
        pin.Quaternion(1, 0, 0, 0),
        np.array([0, 0, 0.25]),
    )

    root_target = pin.SE3(
        pin.Quaternion(1, 0, 0, 0),
        np.array([0, 0, 0]),
    )

    rotation_speed = 0.01
    noise_amplitude_translation = 0.001
    noise_amplitude_rotation = 0.01

    sol_q_last = np.zeros(35)
    sol_q_last[6] = -0.1
    sol_q_last[9] = 0.3
    sol_q_last[10] = -0.2
    sol_q_last[12] = -0.1
    sol_q_last[15] = 0.3
    sol_q_last[16] = -0.2
    user_input = input("Please enter the start signal (enter 's' to start the subsequent program):\n")
    if user_input.lower() == 's':
        step = 0
        while True:
            # Apply rotation noise with bias towards y and z axes
            rotation_noise_L = pin.Quaternion(
                np.cos(np.random.normal(0, noise_amplitude_rotation) / 2),0,np.random.normal(0, noise_amplitude_rotation / 2),0).normalized()  # y bias

            rotation_noise_R = pin.Quaternion(
                np.cos(np.random.normal(0, noise_amplitude_rotation) / 2),0,0,np.random.normal(0, noise_amplitude_rotation / 2)).normalized()  # z bias

            if step <= 30:
                angle = rotation_speed * step
                # lhand_target.rotation = (rotation_noise_L * pin.Quaternion(np.cos(angle / 2), 0, np.sin(angle / 2), 0)).toRotationMatrix()  # y axis
                # rhand_target.rotation = (rotation_noise_R * pin.Quaternion(np.cos(angle / 2), 0, 0, np.sin(angle / 2))).toRotationMatrix()  # z axis
                lhand_target.translation += (np.array([0.001,  0.001, 0.001]) + np.random.normal(0, noise_amplitude_translation, 3))
                rhand_target.translation += (np.array([0.001, -0.001, 0.001]) + np.random.normal(0, noise_amplitude_translation, 3))
                # lfoot_target.rotation = (rotation_noise_L * pin.Quaternion(np.cos(angle / 2), 0, np.sin(angle / 2), 0)).toRotationMatrix()  # y axis
                # rfoot_target.rotation = (rotation_noise_R * pin.Quaternion(np.cos(angle / 2), 0, 0, np.sin(angle / 2))).toRotationMatrix()  # z axis
                lfoot_target.translation += (np.array([0.001,  0.001, 0.001]) + np.random.normal(0, noise_amplitude_translation, 3))
                rfoot_target.translation += (np.array([0.001, -0.001, 0.001]) + np.random.normal(0, noise_amplitude_translation, 3))
            else:
                angle = rotation_speed * (60 - step)
                # lhand_target.rotation = (rotation_noise_L * pin.Quaternion(np.cos(angle / 2), 0, np.sin(angle / 2), 0)).toRotationMatrix()  # y axis
                # rhand_target.rotation = (rotation_noise_R * pin.Quaternion(np.cos(angle / 2), 0, 0, np.sin(angle / 2))).toRotationMatrix()  # z axis
                lhand_target.translation -= (np.array([0.001,  0.001, 0.001]) + np.random.normal(0, noise_amplitude_translation, 3))
                rhand_target.translation -= (np.array([0.001, -0.001, 0.001]) + np.random.normal(0, noise_amplitude_translation, 3))
                # lfoot_target.rotation = (rotation_noise_L * pin.Quaternion(np.cos(angle / 2), 0, np.sin(angle / 2), 0)).toRotationMatrix()  # y axis
                # rfoot_target.rotation = (rotation_noise_R * pin.Quaternion(np.cos(angle / 2), 0, 0, np.sin(angle / 2))).toRotationMatrix()  # z axis
                lfoot_target.translation -= (np.array([0.001,  0.001, 0.001]) + np.random.normal(0, noise_amplitude_translation, 3))
                rfoot_target.translation -= (np.array([0.001, -0.001, 0.001]) + np.random.normal(0, noise_amplitude_translation, 3))

            sol_q = arm_ik.solve_ik(lhand_target.homogeneous, 
                            rhand_target.homogeneous, 
                            lfoot_target.homogeneous, 
                            rfoot_target.homogeneous, 
                            root_target.homogeneous, 
                            head_target.homogeneous,
                            current_lr_arm_motor_q=sol_q_last
                            )
            sol_q_last = sol_q

            step += 1
            if step > 240:
                step = 0
            # time.sleep(0.001)
```

注：在BVH/SMPL文件中，每个关节点都有一套自己的坐标系，当人体在运动时，每个关节点就会相对其父节点发生旋转，这个旋转过程可以用一个四元数表达.

robot_ik处理了肢体长度差异、运动学约束（``scale_lengths()``、``opti.subject_to()``）等问题，这也属于动作重定向算法的难点，所使用的求解模块为CasADi，其求解器为``ipopt``。

求解的目标函数：50 * 位置误差 + 旋转误差 + 0.1 * 平滑项 + 0.02 * 正则化损失

求解的目标即为关节角度（送入g1_retarget.py）。

rotation.py: 

```python
#!/usr/bin/env python3
import numpy as np

rr_R_root = np.zeros((3,3))
rr_R_root[1,0] = 1
rr_R_root[2,1] = 1
rr_R_root[0,2] = 1
root_R_rr = np.linalg.inv(rr_R_root)

def rotx(theta):
    # 旋转角度（以弧度表示）
    theta = np.radians(theta)  # 30度转化为弧度

    # 绕X轴的旋转矩阵
    Rx = np.array([[1, 0, 0],
               [0, np.cos(theta), -np.sin(theta)],
               [0, np.sin(theta), np.cos(theta)]])
    return Rx

def roty(theta):
    # 旋转角度（以弧度表示）
    theta = np.radians(theta)  # 30度转化为弧度

    # 绕X轴的旋转矩阵
    Ry = np.array([[np.cos(theta), 0, np.sin(theta)],
               [0, 1, 0],
               [-np.sin(theta), 0, np.cos(theta)]])
    return Ry

def rotz(theta):
    # 旋转角度（以弧度表示）
    theta = np.radians(theta)  # 30度转化为弧度

    # 绕X轴的旋转矩阵
    Rz = np.array([[np.cos(theta), -np.sin(theta), 0],
               [np.sin(theta), np.cos(theta), 0],
               [0, 0, 1]])
    return Rz

def eulerxyz2mat(axis):
    Rx = rotx(axis[0])
    Ry = roty(axis[1])
    Rz = rotz(axis[2])

    res = (Rx.dot(Ry)).dot(Rz)

    return res

def eulerzyx2mat(axis):
    Rx = rotx(axis[0])
    Ry = roty(axis[1])
    Rz = rotz(axis[2])

    res = (Rz.dot(Ry)).dot(Rx)

    return res

def mat2euler(R):

    # 提取旋转矩阵的元素
    R11, R12, R13 = R[0, 0], R[0, 1], R[0, 2]
    R21, R22, R23 = R[1, 0], R[1, 1], R[1, 2]
    R31, R32, R33 = R[2, 0], R[2, 1], R[2, 2]

    # 计算欧拉角（绕XYZ轴的旋转）
    theta_x = -np.arctan2(R23, R33)
    theta_y = -np.arctan2(-R13, np.sqrt(R11**2 + R12**2))
    theta_z = -np.arctan2(R12, R11)

    # print(f"Euler Angles (XYZ):")
    # print(f"Theta_x (rotation about X-axis): {theta_x} radius")
    # print(f"Theta_y (rotation about Y-axis): {theta_y} radius")
    # print(f"Theta_z (rotation about Z-axis): {theta_z} radius")

    # 将角度从弧度转换为度
    theta_x_deg = np.degrees(theta_x)
    theta_y_deg = np.degrees(theta_y)
    theta_z_deg = np.degrees(theta_z)

    # print(f"Euler Angles (XYZ):")
    # print(f"Theta_x (rotation about X-axis): {theta_x_deg} degrees")
    # print(f"Theta_y (rotation about Y-axis): {theta_y_deg} degrees")
    # print(f"Theta_z (rotation about Z-axis): {theta_z_deg} degrees")

    return np.array([theta_x,theta_y,theta_z])

def mat2euler_zyx(R):
    # 提取旋转矩阵的元素
    R11, R12, R13 = R[0, 0], R[0, 1], R[0, 2]
    R21, R22, R23 = R[1, 0], R[1, 1], R[1, 2]
    R31, R32, R33 = R[2, 0], R[2, 1], R[2, 2]

    # 计算欧拉角（绕ZYX轴的旋转）
    theta_x = np.arctan2(R32, R33)  # 绕X轴的旋转
    theta_y = np.arctan2(-R31, np.sqrt(R11**2 + R21**2))  # 绕Y轴的旋转
    theta_z = np.arctan2(R21, R11)  # 绕Z轴的旋转

    # 将角度从弧度转换为度
    theta_x_deg = np.degrees(theta_x)
    theta_y_deg = np.degrees(theta_y)
    theta_z_deg = np.degrees(theta_z)

    # print(f"Euler Angles (XYZ):")
    # print(f"Theta_x (rotation about X-axis): {theta_x_deg} degrees")
    # print(f"Theta_y (rotation about Y-axis): {theta_y_deg} degrees")
    # print(f"Theta_z (rotation about Z-axis): {theta_z_deg} degrees")

    return np.array([theta_x,theta_y,theta_z])
```

似乎没有实际运用，如上几步都已经有完善的旋转处理，可以忽略或者当个参考。

weighted_moving_filter：

```python
#!/usr/bin/env python
import numpy as np
import matplotlib.pyplot as plt


class WeightedMovingFilter:
    def __init__(self, weights, data_size = 35):
        self._window_size = len(weights)
        self._weights = np.array(weights)
        assert np.isclose(np.sum(self._weights), 1.0), "[WeightedMovingFilter] the sum of weights list must be 1.0!"
        self._data_size = data_size
        self._filtered_data = np.zeros(self._data_size)
        self._data_queue = []

    def _apply_filter(self):
        if len(self._data_queue) < self._window_size:
            return self._data_queue[-1]

        data_array = np.array(self._data_queue)
        temp_filtered_data = np.zeros(self._data_size)
        for i in range(self._data_size):
            temp_filtered_data[i] = np.convolve(data_array[:, i], self._weights, mode='valid')[-1]

        return temp_filtered_data

    def add_data(self, new_data):
        assert len(new_data) == self._data_size

        if len(self._data_queue) > 0 and np.array_equal(new_data, self._data_queue[-1]):
            return  # skip duplicate data

        if len(self._data_queue) >= self._window_size:
            self._data_queue.pop(0)

        self._data_queue.append(new_data)
        self._filtered_data = self._apply_filter()

    @property
    def filtered_data(self):
        return self._filtered_data


def visualize_filter_comparison(filter_params, steps):
    import time
    t = np.linspace(0, 4 * np.pi, steps)
    original_data = np.array([np.sin(t + i) + np.random.normal(0, 0.2, len(t)) for i in range(35)]).T  # sin wave with noise, shape is [len(t), 35]

    plt.figure(figsize=(14, 10))

    for idx, weights in enumerate(filter_params):
        filter = WeightedMovingFilter(weights, 14)
        data_2b_filtered = original_data.copy()
        filtered_data = []

        time1 = time.time()

        for i in range(steps):
            filter.add_data(data_2b_filtered[i][13:27])            # step i, columns 13 to 26 (total:14)
            data_2b_filtered[i][13:27] = filter.filtered_data
            filtered_data.append(data_2b_filtered[i])

        time2 = time.time()
        print(f"filter_params:{filter_params[idx]}, time cosume:{time2 - time1}")

        filtered_data = np.array(filtered_data)

        # col0 should not 2b filtered
        plt.subplot(len(filter_params), 2, idx * 2 + 1)
        plt.plot(filtered_data[:, 0], label=f'Filtered (Window {filter._window_size})')
        plt.plot(original_data[:, 0], 'r--', label='Original', alpha=0.5)
        plt.title(f'Joint 1 - Should not to be filtered.')
        plt.xlabel('Step')
        plt.ylabel('Value')
        plt.legend()

        # col13 should 2b filtered
        plt.subplot(len(filter_params), 2, idx * 2 + 2)
        plt.plot(filtered_data[:, 13], label=f'Filtered (Window {filter._window_size})')
        plt.plot(original_data[:, 13], 'r--', label='Original', alpha=0.5)
        plt.title(f'Joint 13 - Window {filter._window_size}, Weights {weights}')
        plt.xlabel('Step')
        plt.ylabel('Value')
        plt.legend()

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    # windows_size and weights
    filter_params = [ 
        (np.array([0.7, 0.2, 0.1])),
        (np.array([0.5, 0.3, 0.2])),
        (np.array([0.4, 0.3, 0.2, 0.1])),
    ]

    visualize_filter_comparison(filter_params, steps = 100)
```

实现了加权移动平均滤波器。WeightedMovingFilter类：实现加权移动平均滤波算法；visualize_filter_comparison函数：生成测试数据并可视化滤波效果对比。

这里的滤波器是提供给robot_ik.py使用的，其目的是为了平滑机器人关节角度的变化，以减少关节角度的抖动。

3DViewer:

```python
#!/usr/bin/env python3

import pygame
import numpy as np
import transforms3d.euler as euler
from amc_parser import *
import rospy
from sensor_msgs.msg import JointState
from std_msgs.msg import Header
from geometry_msgs.msg import TransformStamped
import tf
from scipy.spatial.transform import Rotation as Rot
from std_msgs.msg import Int32
from rotation import *
import os


class Viewer:
  def __init__(self, motions=None, fps=None):
    """
    Display motion sequence in 3D.

    Parameter
    ---------
    joints: Dict returned from `amc_parser.parse_asf`. Keys are joint names and
    values are instance of Joint class.

    motions: List returned from `amc_parser.parse_amc. Each element is a dict
    with joint names as keys and relative rotation degree as values.

    """
    self.motions = motions
    self.frame = 0 # current frame of the motion sequence
    self.playing = False # whether is playing the motion sequence
    self.fps = fps # frame rate

    # whether is dragging
    self.rotate_dragging = False
    self.translate_dragging = False
    # old mouse cursor position
    self.old_x = 0
    self.old_y = 0
    # global rotation
    self.global_rx = 0
    self.global_ry = 0
    # rotation matrix for camera moving
    self.rotation_R = np.eye(3)
    # rotation speed
    self.speed_rx = np.pi / 90
    self.speed_ry = np.pi / 90
    # translation speed
    self.speed_trans = 0.25
    self.speed_zoom = 0.5
    # whether the main loop should break
    self.done = False
    # default translate set manually to make sure the skeleton is in the middle
    # of the window
    # if you can't see anything in the screen, this is the first parameter you
    # need to adjust
    self.default_translate = np.array([0, -20, -100], dtype=np.float32)
    self.translate = np.copy(self.default_translate)

    pygame.init()
    self.screen_size = (480, 240)
    self.screen = pygame.display.set_mode(
      self.screen_size, pygame.DOUBLEBUF | pygame.OPENGL
    )
    pygame.display.set_caption(
      'AMC Parser - frame %d / %d' % (self.frame, len(self.motions))
    )

    ## init ros pubulisher
    rospy.init_node('joint_state_publisher_node', anonymous=True)

    # 创建一个 Publisher，用于发布 JointState 消息
    self.joint_pub = rospy.Publisher('joint_states', JointState, queue_size=10)
    self.frameNumpub = rospy.Publisher('/frame_num', Int32, queue_size=10)
    # 定义发布频率
    self.rate = rospy.Rate(self.fps)

    self.joint_names = ['left_hip_joint_x', 'left_hip_joint_y', 'left_hip_joint_z', \
                    'left_knee_joint', \
                    'lfoot_joint_x', 'lfoot_joint_z', \
                    'ltoe_joint', \
                    'right_hip_joint_x', 'right_hip_joint_y', 'right_hip_joint_z',
                    'right_knee_joint', \
                    'rfoot_joint_x', 'rfoot_joint_z', \
                    'rtoe_joint', \
                    'lowerback_joint_x', 'lowerback_joint_y', 'lowerback_joint_z', \
                    'upperback_joint_x', 'upperback_joint_y', 'upperback_joint_z', \
                    'thorax_joint_x', 'thorax_joint_y', 'thorax_joint_z', \
                    'lowerneck_joint_x', 'lowerneck_joint_y', 'lowerneck_joint_z', \
                    'upperneck_joint_x', 'upperneck_joint_y', 'upperneck_joint_z', \
                    'head_joint_x', 'head_joint_y', 'head_joint_z', \
                    'lclavicle_joint_y', 'lclavicle_joint_z', \
                    'lshoulder_joint_x', 'lshoulder_joint_y', 'lshoulder_joint_z', \
                    'left_elbow_joint', \
                    'lwrist_joint', \
                    'lhand_joint_x', 'lhand_joint_z', \
                    'lfingers_joint', \
                    'lthumb_joint_x', 'lthumb_joint_z', \
                    'rclavicle_joint_y', 'rclavicle_joint_z', \
                    'rshoulder_joint_x', 'rshoulder_joint_y', 'rshoulder_joint_z', \
                    'right_elbow_joint', \
                    'rwrist_joint', \
                    'rhand_joint_x', 'rhand_joint_z', \
                    'rfingers_joint', \
                    'rthumb_joint_x', 'rthumb_joint_z']

    self.joint_positions = []
    for _ in range(len(self.joint_names)):
        self.joint_positions.append(0.0)

    # 时间变量，用于模拟关节的运动
    self.start_time = rospy.Time.now().to_sec()
    self.br = tf.TransformBroadcaster()
    # 发布 tf 转换
    # br.sendTransform(goal_msg.pose.position,goal_msg.pose.orientation,rospy.Time.now(),"pelvis","map")
    self.t = TransformStamped()
    self.t.header.frame_id = 'world'
    self.t.header.stamp = rospy.Time(0)
    self.t.child_frame_id = 'root'
    self.t.transform.translation.x = 0
    self.t.transform.translation.y = 0
    self.t.transform.translation.z = 0.5
    self.t.transform.rotation.w=1
    self.t.transform.rotation.x=0
    self.t.transform.rotation.y=0
    self.t.transform.rotation.z=0

  def process_event(self):
    """
    Handle user interface events: keydown, close, dragging.

    """
    for event in pygame.event.get():
      if event.type == pygame.QUIT:
        self.done = True
      elif event.type == pygame.KEYDOWN:
        if event.key == pygame.K_RETURN: # reset camera
          self.translate = self.default_translate
          self.global_rx = 0
          self.global_ry = 0
        elif event.key == pygame.K_SPACE:
          self.playing = not self.playing
      elif event.type == pygame.MOUSEBUTTONDOWN: # dragging
        if event.button == 1:
          self.rotate_dragging = True
        else:
          self.translate_dragging = True
        self.old_x, self.old_y = event.pos
      elif event.type == pygame.MOUSEBUTTONUP:
        if event.button == 1:
          self.rotate_dragging = False
        else:
          self.translate_dragging = False
      elif event.type == pygame.MOUSEMOTION:
        if self.translate_dragging:
          # haven't figure out best way to implement this
          pass
        elif self.rotate_dragging:
          new_x, new_y = event.pos
          self.global_ry -= (new_x - self.old_x) / \
              self.screen_size[0] * np.pi
          self.global_rx -= (new_y - self.old_y) / \
              self.screen_size[1] * np.pi
          self.old_x, self.old_y = new_x, new_y
    pressed = pygame.key.get_pressed()
    # rotation
    if pressed[pygame.K_DOWN]:
      self.global_rx -= self.speed_rx
    if pressed[pygame.K_UP]:
      self. global_rx += self.speed_rx
    if pressed[pygame.K_LEFT]:
      self.global_ry += self.speed_ry
    if pressed[pygame.K_RIGHT]:
      self.global_ry -= self.speed_ry
    # moving
    if pressed[pygame.K_a]:
      self.translate[0] -= self.speed_trans
    if pressed[pygame.K_d]:
      self.translate[0] += self.speed_trans
    if pressed[pygame.K_w]:
      self.translate[1] += self.speed_trans
    if pressed[pygame.K_s]:
      self.translate[1] -= self.speed_trans
    if pressed[pygame.K_q]:
      self.translate[2] += self.speed_zoom
    if pressed[pygame.K_e]:
      self.translate[2] -= self.speed_zoom
    # forward and rewind
    if pressed[pygame.K_COMMA]:
      self.frame -= 1
      if self.frame < 0:
        self.frame = len(self.motions) - 1
    if pressed[pygame.K_PERIOD]:
      self.frame += 1
      if self.frame >= len(self.motions):
        self.frame = 0
    # global rotation
    grx = euler.euler2mat(self.global_rx, 0, 0)
    gry = euler.euler2mat(0, self.global_ry, 0)
    self.rotation_R = grx.dot(gry)

  def draw(self):
    joint_state_msg = JointState()
    joint_state_msg.header = Header()
    joint_state_msg.header.stamp = rospy.Time.now()  
    joint_state_msg.name = self.joint_names             
    joint_state_msg.position = self.joint_positions      
    joint_state_msg.velocity = []                  
    joint_state_msg.effort = []                    

    self.joint_pub.publish(joint_state_msg)
    self.frameNumpub.publish(self.frame)
    self.br.sendTransformMessage(self.t)


  def set_motion(self, motions):
    """
    Set motion sequence for viewer.

    Paramter
    --------
    motions: List returned from `amc_parser.parse_amc. Each element is a dict
    with joint names as keys and relative rotation degree as values.

    """
    self.motions = motions

  def run(self):
    """
    Main loop.

    """

    while not self.done:
      self.process_event()
      ## 关节赋值
      motion = self.motions[self.frame]

      # root
      root_joint = np.array(motion['root'])
      base_pos = rr_R_root @ (root_joint[:3] * 0.056444)
      angle = root_joint[3:6]
      Rotation_Matrix = rr_R_root @ eulerzyx2mat(angle) @ rotz(-90.0) @ roty(-90.0)
      rotation = Rot.from_matrix(Rotation_Matrix)
      base_quaternion = rotation.as_quat()
      self.t.header.stamp = rospy.Time.now()
      self.t.transform.translation.x = base_pos[0]
      self.t.transform.translation.y = base_pos[1]
      self.t.transform.translation.z = base_pos[2]
      self.t.transform.rotation.x = base_quaternion[0]
      self.t.transform.rotation.y = base_quaternion[1]
      self.t.transform.rotation.z = base_quaternion[2]
      self.t.transform.rotation.w = base_quaternion[3]

      # joint
      self.joint_positions[0:3] = np.array(motion['lfemur'])
      self.joint_positions[3] = motion['ltibia'][0] 
      self.joint_positions[4:6] = np.array(motion['lfoot']) 
      self.joint_positions[6] = np.array(motion['ltoes'])[0] 
      self.joint_positions[7:10] = np.array(motion['rfemur']) 
      self.joint_positions[10] = np.array(motion['rtibia'])[0]
      self.joint_positions[11:13] = np.array(motion['rfoot']) 
      self.joint_positions[13] = np.array(motion['rtoes'])[0] 

      self.joint_positions[14:17] = np.array(motion['lowerback']) 
      self.joint_positions[17:20] = np.array(motion['upperback']) 
      self.joint_positions[20:23] = np.array(motion['thorax']) 
      self.joint_positions[23:26] = np.array(motion['lowerneck']) 
      self.joint_positions[26:29] = np.array(motion['upperneck']) 
      self.joint_positions[29:32] = np.array(motion['head'])

      self.joint_positions[32:34] = np.array(motion['lclavicle'])
      self.joint_positions[34:37] = np.array(motion['lhumerus'])
      self.joint_positions[37] = np.array(motion['lradius'])[0]
      self.joint_positions[38] = np.array(motion['lwrist'])[0]
      self.joint_positions[39:41] = np.array(motion['lhand'])
      self.joint_positions[41] = np.array(motion['lfingers'])[0]
      self.joint_positions[42:44] = np.array(motion['lthumb'])

      self.joint_positions[44:46] = np.array(motion['rclavicle'])
      self.joint_positions[46:49] = np.array(motion['rhumerus'])
      self.joint_positions[49] = np.array(motion['rradius'])[0]
      self.joint_positions[50] = np.array(motion['rwrist'])[0]
      self.joint_positions[51:53] = np.array(motion['rhand'])
      self.joint_positions[53] = np.array(motion['rfingers'])[0]
      self.joint_positions[54:56] = np.array(motion['rthumb'])

      # 转换为radius
      self.joint_positions = [x * 3.1415926 / 180.0 for x in self.joint_positions]

      if self.playing:
        self.frame += 1
        if self.frame >= len(self.motions):
          self.frame = 0
      self.draw() ## 发布关节数据
      pygame.display.set_caption(
        'AMC Parser - frame %d / %d' % (self.frame, len(self.motions))
      )
      self.rate.sleep()
    pygame.quit()


if __name__ == '__main__':
  fps = rospy.get_param('motion_fps', 12)
  current_path = os.path.dirname(os.path.abspath(__file__))
  amcfile = rospy.get_param('amc_file', '86_01.amc')
  amc_path = os.path.join(current_path, '../all_asfamc/subjects/86', amcfile)
  motions = parse_amc(amc_path)
  v = Viewer(motions, fps=fps)
  v.run()
```

解析AMC格式的运动捕捉文件，通过Pygame窗口展示3D骨骼动画，并实时将关节角度数据通过ROS的JointState消息和TF变换发布。定义了人体62个关节的名称列表。

## 2. 项目部署

```bash
git clone https://github.com/ccrpRepo/mocap_retarget.git
cd mocap_retarget
catkin_make -DCMAKE_BUILD_TYPE=3.5 # 也可以直接catkin_make
source devel/setup.bash
roslaunch mocap_retarget g1_retarget.launch
# 点击AMC Parser窗口，空格键开始播放
```

如果遇到模块需要补装，或者Pinocchio版本不对，可以从源码编译。但是我尝试从源码编译后，编译时报错，这是因为3.1.0的版本需要的CMAKE版本较低。最后尝试清理掉冗余的pinocchio，``pip install pin``成功了。
