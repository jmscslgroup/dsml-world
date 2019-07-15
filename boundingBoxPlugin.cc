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
 
 class boundingBoxPlugin : public WorldPlugin
 {  
  public: void Load(physics::WorldPtr _parent, sdf::ElementPtr /*sdf*/)
  {
  world = _parent;
  //Get number of models
  totModels = world->gazebo::physics::World::ModelCount() - 1;
  std::cout<< "Load debug Msg - total model count: " << totModels << "\n";

    for(int i = 1; i <= totModels; i++) {
        //using index, get model
        obj = world->gazebo::physics::World::ModelByIndex(i);
        //for each model, get the bounding box
        ignition::math::Box boundingBox = obj->BoundingBox();
        //get model name
        std::string modelName = obj->GetName();
        //print bounding box info
        std::cout<< modelName << "'s bounding box is " << boundingBox << "\n";
    }
    
  }
 };
 //Register this plugin with the simulator
 GZ_REGISTER_WORLD_PLUGIN(boundingBoxPlugin)
}
