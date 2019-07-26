#!/usr/bin/env python

import rospy
from std_msgs.msg import String, Float64
from geometry_msgs.msg import Twist, Pose
import sys, getopt, math

PI = 3.1415926535897

class catvehicle:
    
    def __init__(self):
        #creates unique node 'catvehicle_controller'
        rospy.init_node('catvehicle_controller', anonymous=True)
        
        #publisher to cmd_vel topic
        self.velocity_publisher = rospy.Publisher('/catvehicle/cmd_vel', Twist, queue_size = 10)
        
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
        
        speed = 3.0
        minDist = 5.0
        
        currentDist = Float64()
        vel_msg = Twist()
        
        vel_msg.linear.y = 0
        vel_msg.linear.z = 0
        
        vel_msg.angular.x = 0
        vel_msg.angular.y = 0
        vel_msg.angular.z = self.angle.data
        #set angular velocity to towwrd nearest object - if you want it to go away, set as negative (possibly)
        #radians or degrees?
        print(self.angle.data)
        
        print('Test 0 before if statement')
        
        if(isReady):
            vel_msg.linear.x = speed
        else:
            vel_msg.linear.x = 0
            
        while not rospy.is_shutdown():
            t0 = rospy.Time.now().to_sec()
            print("Test 1 first while loop")
            currentDist = self.dist.data
            print(currentDist)
                
            while(currentDist >= minDist):
                #publish the velocity
                self.velocity_publisher.publish(vel_msg)
                #update current distance
                currentDist = self.dist.data
                print(self.dist.data)
                #update publishing rate
                self.rate.sleep()
            
            print("Test 3 exited 2nd while loop")
            vel_msg.linear.x = 0
            self.velocity_publisher.publish(vel_msg)
            print("Test 4 published velocity")
            
            rospy.spin()
 
if __name__ == '__main__':
    try:
        #testing our function
        x = catvehicle()
        x.move2object()
    except rospy.ROSInterruptException:
        pass
        
        
