DSML WORLDMAKING SOFTWARE README

TOC
Section 1: Intro
Section 2: Setting Up
Section 3: Using the Modeling Language
Section 4: Running the Worlds

1: Intro
Welcome to the DSML Worldmaking software! This git repo contains
several things: First, it has a repository that contains WebGME modeling 
software to generate gazebo worlds, launchfiles and scripts. Second, it has 
a plugin for gazebo that detects if a world contains overlapping models. 
Third, it contains executables that let the CATVehicle, whether real or 
simulated, drive according to a certain behavior. The purpose of this project
is to create worlds easily with worldfiles and also create a script that runs
them one by one and test whether or not they are "safe" by using a certain
vehicle behavior. 

2: Setting Up
Please read the Gazebo tutorial on plugins in order to use our collision
detection plugin. In the current version of the program you must compile it
yourself and specify where the directory is. Other than this, please
put the "worldgme" directory somewhere outside the master folder so you
can run it. In the javascript plugin, assumptions are made as to what your
computer's name is. Please search and replace all instances of "reu-cat" with
the correct name if this is incorrect. Also, obviously, we are assuming that
you have all relevant "catvehicle" data downloaded. 

3: Using the Modeling Language
First, run "npm start" in the "worldgme" folder in order to use the modeling
software, and go to "http://localhost:8888" in your browser. These are
basic features of WebGME and other details on this software can be found
through its various tutorials. Now that you're in the environment, you should
be able to open the "Gazebo_World" project in WebGME. To make your first world, 
right click on "ROOT" and create a "WorldfilesContainer" child. In this
"WorldfilesContainer" object (with a name of your choosing) you can place
as many "Worldfile" objects (also with names of your choosing; please pick
different names for each world) as you want. Double-click on those objects
and place whatever "auto_position_car" (drag-and-drop location), 
"manual_position_car" (input whatever coords you want), or "asphalt_plane"
(x and y coords only) objects as you want. You can change the names of each
object to any model name you want it to be in gazebo (please make sure it
corresponds to a Gazebo model that you have installed, for more models go to
https://bitbucket.org/osrf/gazebo_models/src/default/ ). When you're done, go 
back to your "WorldfilesContainer" object and run the plugin (WorldMaker). 
The "OutputFiles.zip" folder contains what you want. 

4: Running the worlds
Inside the OutputFiles folder are 4 things: First is a readme that contains
some relevant information that may or may not be made redundant by that of
this document. Second is "script.py". Third and fourth are the "worlds" and 
"launch" folders that respectively contain the generate world files and their 
launchfiles. Our script automates things: use "python2 script.py" to run it. 
It will run one by one the worlds you have generated, with our defined
behavior. Here's what happens for each world; if it crashes, the simulation 
stops and an error will be generated. If it doesn't crash, it moves onto the 
next world until none are left to test. That's all there is to it! If you want
to run your worlds manually, please move the world files to 
"catvehicle_ws/src/catvehicle/worlds", and the launchfiles to
"catvehicle_ws/src/catvehicle/launch", and then run "roslaunch catvehicle 
<launchfile>", and "gzclient" to view in gazebo. The CATVehicle is spawned by 
running this code. To use the collision detector it will be output when you do 
"gzserver <worldfile> --verbose", as long as you specify the location of the 
worldfile. 
