#include <sdf/sdf.hh>
#include <ignition/math/Pose3.hh>
#include "gazebo/common/Plugin.hh"
#include "gazebo/msgs/msgs.hh"
#include "gazebo/transport/transport.hh"

#include <functional>
#include <gazebo/gazebo.hh>
#include <gazebo/physics/physics.hh>
#include <gazebo/common/common.hh>
#include <ignition/math/Vector3.hh>

//Bounding Box Plugin - this plugin should create a World
//Plugin, initializes the Transport system by
//creating a new Node, and publish the bounding box data.

namespace gazebo
{  
  physics::WorldPtr world;
  physics::ModelPtr obj;
  int totModels;
  std::vector<std::string> modNames;
  std::vector<double> xMin;
  std::vector<double> xMax;
  std::vector<double> yMin;
  std::vector<double> yMax;
 
 class boundingBoxPlugin : public WorldPlugin
 {
  public: void Load(physics::WorldPtr _parent, sdf::ElementPtr /*sdf*/)
  {
  world = _parent;
  //Get number of models, set size of modValList to totModels
  totModels = world->gazebo::physics::World::ModelCount() - 1;
  modNames.resize(totModels);
  
  std::cout<< "Model count: " << totModels << "\n\n";
    //For loop to get bounding box and name data from each model
    for(int i = 1; i <= totModels; i++) {
        //get model by index, then get bounding box
        obj = world->gazebo::physics::World::ModelByIndex(i);
            ignition::math::Box boundingBox = obj->BoundingBox();
            //get min and max values and store in temp varaibles
            ignition::math::v4::Vector3<double> minVal = boundingBox.Min();
            ignition::math::v4::Vector3<double> maxVal = boundingBox.Max();
            //store min and max x and y values and names to a unique variable
            modNames[i-1] = obj->GetName();
            xMin.push_back(minVal[0]);
            yMin.push_back(minVal[1]);
            xMax.push_back(maxVal[0]);
            yMax.push_back(maxVal[1]);
            //TEST - print bounding box info - uncomment for verification
            //std::cout<< modNames[i-1] << ":\n";
            //std::cout<< "Min x is " << xMin[i-1] << "\n";
            //std::cout<< "Min y is " << yMin[i-1] << "\n";
            //std::cout<< "Max x is " << xMax[i-1] << "\n";
            //std::cout<< "Max y is " << yMax[i-1] << "\n";
    }
      //Collision detection for loop!
      for(int j = 0; j < totModels; j++) {
        for(int k = j + 1; k < totModels; k++) {
            if(modNames[j] != "asphalt_plane" && modNames[k] != "asphalt_plane")
            {
            float d1x = xMin[k] - xMax[j];
            float d1y = yMin[k] - yMax[j];
            float d2x = xMin[j] - xMax[k];
            float d2y = yMin[j] - yMax[k];
        
            if(d1x > 0.0f || d1y > 0.0f){
                //TEST statement: uncomment for verification
                //std::cout<< modNames[j] <<" and " << modNames[k] << " do not overlap.\n";
            }
            else if(d2x > 0.0f || d2y > 0.0f){
                //TEST statement: uncomment for verification
                //std::cout<< modNames[j] <<" and " << modNames[k] << " do not overlap.\n";
            }
            else{
                std::cout<< "ERROR!\n" << modNames[j] <<" and " << modNames[k] << " are overlapping\n";
            }
          }
        }
      } 
  }
 };
 //Register this plugin with the simulator
 GZ_REGISTER_WORLD_PLUGIN(boundingBoxPlugin)
}

