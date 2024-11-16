import numpy as np
import cv2 as cv


def GetRed(img):
    """
    提取图中的红色部分
    """
    # 转化为hsv空间
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    print(hsv.shape)

    # 颜色在HSV空间下的上下限156-180还能改成0-10
    low_hsv = np.array([156, 43, 46])
    high_hsv = np.array([180, 255, 255])

    # 使用opencv的inRange函数提取颜色
    mask = cv2.inRange(hsv, lowerb=low_hsv, upperb=high_hsv)
    Red = cv2.bitwise_and(img, img, mask=mask)

    return Red
 



if __name__ == '__main__':
    src = "2.png"
    img = cv.imread(src)

    # 红色提取出来
    Red = GetRed(img)

    cv.imshow("Red", Red)
    cv.waitKey()
