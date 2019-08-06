#!/usr/bin/env python

import rospy
from std_msgs.msg import String, Float64
from geometry_msgs.msg import Twist, Pose
import sys, getopt, math

PI = 3.1415926535897
#Controller to move towards or away from an object - similar to avoidObject.py, but it meant for Gazebo catvehicle model

class catvehicle:
    
    def __init__(self):
        #creates unique node 'catvehicle_controller'
        rospy.init_node('catvehicle_controller', anonymous=True)
        
        #publisher to cmd_vel topic
        self.velocity_publisher = rospy.Publisher('/catvehicle/cmd_vel', Twist, queue_size = 1)
        
        #subsciber to dist, called when a Float64 message is recieved
        self.dist_subscriber = rospy.Subscriber('/catvehicle/distanceEstimatorSteeringBased/dist', Float64, self.update_dist)
        
        self.dist = Float64()
        self.rate = rospy.Rate(10)
        
        self.angle_subscriber = rospy.Subscriber('/catvehicle/distanceEstimatorSteeringBased/angle', Float64, self.update_angle)
        
        self.angle = Float64()
        self.rate = rospy.Rate(10)
        
        
    def update_dist(self, data):
        self.dist = data
        
    def update_angle(self, data):
        self.angle = data
        
    def move2object(self):
        """Moves the car towards an object"""
        print("Press 1 to begin. ")
        isReady = input("Begin?: ")
        
        speed = 5.0
        minDist = 8.0
        
        currentDist = Float64()
        vel_msg = Twist()
        
        #initialize everything but angular.z and linear.x to 0
        vel_msg.linear.y = 0
        vel_msg.linear.z = 0
        
        vel_msg.angular.x = 0
        vel_msg.angular.y = 0
        
        #converting input angle from rads to degress
        degAngle = self.angle.data*(180/PI)
        
        #print distance and angle data
        print(self.angle.data)
        print(degAngle)
        
        if(isReady):
            vel_msg.linear.x = speed
            vel_msg.angular.z = speed
        else:
            vel_msg.linear.x = 0
            vel_msg.angular.z = 0
            
        while not rospy.is_shutdown():
            t0 = rospy.Time.now().to_sec()
            currentDist = self.dist.data
            print(currentDist)
                
            while(currentDist >= minDist):
                print(self.dist.data)
                #if catvehicle steers away, steer back towards the closest object
                if(degAngle < 1.0 and degAngle > -1.0):
                    vel_msg.angular.z = 0
                elif(degAngle < -1.0):
                    vel_msg.angular.z = speed
                else:
                    vel_msg.angular.z = -speed
                print(self.angle.data)
                #update current distance
                currentDist = self.dist.data
                #update angle
                degAngle = self.angle.data
                #publish the velocity
                self.velocity_publisher.publish(vel_msg)
                
                #update publishing rate
                self.rate.sleep()
            
            vel_msg.linear.x = 0
            self.velocity_publisher.publish(vel_msg)
            if(currentDist <= minDist):
                print("Script exited: TOO CLOSE")
            
            rospy.spin()
 
if __name__ == '__main__':
    try:
        #testing our function
        x = catvehicle()
        x.move2object()
    except rospy.ROSInterruptException:
        pass
