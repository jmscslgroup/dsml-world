#!/usr/bin/env python

import rospy
from std_msgs.msg import String, Float64
from geometry_msgs.msg import Twist, Pose
import sys, getopt, math
from catvehicle.msg import Dist, Angle
PI = 3.1415926535897

class objectAvoid:

    def __init__(self):
        # Creates a node with name 'catvehicle_controller' and make sure it is a
        # unique node (using anonymous=True).
        rospy.init_node('catvehicle_controller', anonymous=True)

        # Publisher which will publish to the topic '/catvehicle/cmd_vel'.
        self.velocity_publisher = rospy.Publisher('/catvehicle/cmd_vel', Twist, queue_size=10)

        # A subscriber to the topic '/catvheicle/distanceEstimatorSteeringBased/dist'. self.update_dist is called
        # when a message of type Dist is received.
        self.dist_subscriber = rospy.Subscriber('/catvehicle/distanceEstimatorSteeringBased/dist', Dist, self.update_dist)

        self.dist = Dist()
        self.rate = rospy.Rate(10)
        
        # A subscriber to the topic '/catvehicle/distanceEstimatorSteeringBased/angle'. self.update_angle is called
        # when a message of type Angle is recieved
        self.angle_subscriber = rospy.Subscriber('/catvehicle/distanceEstimatorSteeringBased/angle', Angle, self.update_angle)
        
        self.angle = Angle()
        self.rate = rospy.Rate(10)
        

    def update_dist(self, data):
        """Callback function which is called when a new message of type Dist is
        received by the subscriber."""
        self.dist = data
    
    def update_angle(self, data):
        self.angle = data
        
    def moveAndAway(self):
        #moves the turtle forward and away from objects in its path
        print("Press any key to begin. ")
        speed = 3
        distance = 25
        isReady = input("Begin?: ") #true or false
        isCrash = False
        
        if(isReady):
            vel_msg.linear.x = speed
        else:
            vel_msg.linear.x = 0
            
        vel_msg.linear.y = 0
        vel_msg.linear.z = 0
        vel_msg.angular.y = 0
        vel_msg.angular.z = 0
        
        if():
            vel_msg.angular.x = (angle*180)/PI

        # If we press control + C, the node will stop.
        rospy.spin()

if __name__ == '__main__':
    try:
        x = TurtleBot()
        x.move2goal()
    except rospy.ROSInterruptException:
        pass
