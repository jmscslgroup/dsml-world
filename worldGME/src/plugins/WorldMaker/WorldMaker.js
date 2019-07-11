/*globals define*/
/*eslint-env node, browser*/

/**
 * Generated by PluginGenerator 2.20.5 from webgme on Thu Jun 20 2019 09:46:26 GMT-0700 (Pacific Daylight Time).
 * A plugin that inherits from the PluginBase. To see source code documentation about available
 * properties and methods visit %host%/docs/source/PluginBase.html.
 */

define([
    'plugin/PluginConfig',
    'text!./metadata.json',
    'plugin/PluginBase'
], function (
    PluginConfig,
    pluginMetadata,
    PluginBase) {
    'use strict';

    pluginMetadata = JSON.parse(pluginMetadata);

    /**
     * Initializes a new instance of WorldMaker.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin WorldMaker.
     * @constructor
     */
    function WorldMaker() {
        // Call base class' constructor.
        PluginBase.call(this);
        this.pluginMetadata = pluginMetadata;
    }

    /**
     * Metadata associated with the plugin. Contains id, name, version, description, icon, configStructure etc.
     * This is also available at the instance at this.pluginMetadata.
     * @type {object}
     */
    WorldMaker.metadata = pluginMetadata;

    // Prototypical inheritance from PluginBase.
    WorldMaker.prototype = Object.create(PluginBase.prototype);
    WorldMaker.prototype.constructor = WorldMaker;

    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(Error|null, plugin.PluginResult)} callback - the result callback
     */
    WorldMaker.prototype.main = function (callback) {

        /**
        this.logger.debug('This is a debug message.');
        this.logger.info('This is an info message.');
        this.logger.warn('This is a warning message.');
        this.logger.error('This is an error message.');
        */

            // TODO: Change metamodel architecture: Should be objects that contain worlds.

        var self = this,
            core = this.core,
            logger = this.logger,
            modelJson = {
                name: '',
                number: '',
                worlds: [],
                worldNames: [],
                launchFiles: []
                },
            activeNode = this.activeNode;

        async function getWorlds(data) {
            var worldData = {
                name: '',
                models: [],
                planes: [],
                posModels: [],
                jerWorlds: [],
                cityWorldSs: []
            };

            worldData.name = core.getAttribute(data, 'name');

            var newChildrenPaths = core.getChildrenPaths(data);
            modelJson.number.push(newChildrenPaths);

            await new Promise(done=> {
                self.loadNodeMap(data)
                    .then(function (nodes) {
                        console.log("hit 1");
                        var newChildrenPaths = core.getChildrenPaths(data);
                        for (var i = 0; i < newChildrenPaths.length; i += 1) {
                            var nodeD = nodes[newChildrenPaths[i]];
                            if (self.isMetaTypeOf(nodeD, self.META.road_with_jerseyB)) {
                                worldData.jerWorlds.push(getJerseyWorld(nodeD));
                            } else if (self.isMetaTypeOf(nodeD, self.META.city_block_straight)) {
                                worldData.cityWorldSs.push(getCityBlockStraight(nodeD));
                            } else if (self.isMetaTypeOf(nodeD, self.META.Models)) {
                                worldData.models.push(getModels(nodeD));
                            } else if (self.isMetaTypeOf(nodeD, self.META.Planes)) {
                                worldData.planes.push(getPlanes(nodeD));
                            } else if (self.isMetaTypeOf(nodeD, self.META.PositionModel)) {
                                console.log("hit posModelPush: " + getPosModels(nodeD).name);
                                worldData.posModels.push(getPosModels(nodeD));
                            }
                        }
                        return worldData;
                    }).then(function(data) {
                    var launchFile = getLaunchFile(data);
                    var worldFile = getWorldFile(data);
                    modelJson.worlds.push(worldFile);
                    modelJson.launchFiles.push(launchFile);
                    modelJson.worldNames.push(data.name);
                })
                done()
            })
            function done(){
                console.log("loaded node map");
            }
            console.log("hit worldData make: " + JSON.stringify(worldData, null, 2),);
        }

        function getModels(node)
        {
            var modelData= {
                name: '',
                x_coord: 0,
                y_coord: 0,
                z_coord: 0,
                xi_coord: 0,
                yi_coord: 0,
                zi_coord: 0
            };

            modelData.name = core.getAttribute(node, 'name');
            modelData.x_coord = core.getAttribute(node, 'x_location');
            modelData.y_coord = core.getAttribute(node, 'y_location');
            modelData.z_coord = core.getAttribute(node, 'z_location');
            modelData.xi_coord = core.getAttribute(node, 'xi_location');
            modelData.yi_coord = core.getAttribute(node, 'yi_location');
            modelData.zi_coord = core.getAttribute(node, 'zi_location');

            //worldData.models.push(modelData);
            return modelData;
        }

        function getPosModels(node){
            var posModelData = {
                name: '',
                x_coord: 0,
                y_coord: 0,
                yaw: 0
            };

            posModelData.name = core.getAttribute(node, 'name');
            var posModelPos = self.core.getRegistry(node, 'position');

            // the "position" values are pretty big so we will divide them by 10 to scale down.
            posModelData.x_coord = posModelPos.x / 10;
            posModelData.y_coord = posModelPos.y / 10;

            // Angle is stored in "rotation"
            posModelData.yaw = self.core.getRegistry(node, 'rotation');

            console.log("hit posmodeldata: " + posModelData.name);

            return posModelData;
            //worldData.posModels.push(posModelData);

        }

        function getPlanes(node)
        {
            var planeData= {
                name: '',
                x_coord: 0,
                y_coord: 0
            };

            planeData.name = core.getAttribute(node, 'name');
            planeData.x_coord = core.getAttribute(node, 'x_location');
            planeData.y_coord = core.getAttribute(node, 'y_location');

            return planeData;
            //worldData.planes.push(planeData);
        }

        function getJerseyWorld(node)
        {
            var jerWorldData = {
                x_coord: 0,
                y_coord: 0
            };

            jerWorldData.name = core.getAttribute(node, 'name');
            var jerWorldPos = self.core.getRegistry(node, 'position');

            // the "position" values are pretty big so we will divide them by 10 to scale down.
            jerWorldData.x_coord = jerWorldPos.x / 10;
            jerWorldData.y_coord = jerWorldPos.y / 10;

            return jerWorldData;
            //worldData.jerWorlds.push(jerWorldData);
        }

        function getCityBlockStraight(node)
        {
            var cityBlockSData = {
                x_coord: 0,
                y_coord: 0
            };

            cityBlockSData.name = core.getAttribute(node, 'name');
            var cityBlockSPos = self.core.getRegistry(node, 'position');

            // the "position" values are pretty big so we will divide them by 10 to scale down.
            cityBlockSData.x_coord = cityBlockSPos.x / 10;
            cityBlockSData.y_coord = cityBlockSPos.y / 10;

            return cityBlockSData;
            //worldData.cityWorldSs.push(cityBlockSData);
        }


        // This produces a launchfile that will spawn the catVehicle in a world.
        function getLaunchFile(data){
            var launchFile = '';

            launchFile +=
                "<!--This is a custom ros catvehicle launchfile created by the worldmaker WebGME plugin.-->\n"+
                "<launch>\n<arg name=\"paused\" default=\"false\"/>\n"+
                "<arg name=\"use_sim_time\" default=\"true\"/>\n"+
                "<arg name=\"gui\" default=\"false\"/>\n" +
                "<arg name=\"headless\" default=\"false\"/>\n" +
                "<arg name=\"debug\" default=\"false\"/>\n " +
                "<include file=\"$(find gazebo_ros)/launch/empty_world.launch\">\n" +

                // Should update to include custom name.
                "<arg name=\"world_name\" value=\"$(find catvehicle)/worlds/" + data.name +
                ".world\"/>\n" +
                "<arg name=\"debug\" value=\"$(arg debug)\" />\n" +
                "<arg name=\"gui\" value=\"$(arg gui)\" />\n" +
                "<arg name=\"paused\" value=\"$(arg paused)\"/>\n" +
                "<arg name=\"use_sim_time\" value=\"$(arg use_sim_time)\"/>\n"+
                "<arg name=\"headless\" value=\"$(arg headless)\"/>\n" +
                "</include>" +
                "<group ns=\"catvehicle\">\n" +
                "<param name=\"robot_description\" command=\"$(find xacro)/xacro.py "+
                "\'$(find catvehicle)/urdf/catvehicle.xacro\' roboname:=\'catvehicle\'\" />\n"+
                "<include file=\"$(find catvehicle)/launch/catvehicle.launch\">\n" +
                "<arg name=\"robot_name\" value=\"catvehicle\"/>\n" +

                // Could include position data here?
                "<arg name=\"init_pose\" value=\"-x 0 -y 0 -z 0\"/>\n" +
                "<arg name=\"config_file\" value=\"catvehicle_control.yaml\"/>\n" +
                "</include>\n</group>\n\n </launch>";

            return launchFile;
        }

        function getScript() {
            var scriptFile = '';

            scriptFile += "#!/bin/bash\n\n";

            // Move world and launchfiles to ros directory.
            // TODO: change directory from catvehicle to (find).
            for(var i = 0; i < modelJson.worldNames.length; i++)
            {
                scriptFile +=
                    "eval mv /home/reu-cat/Downloads/" + modelJson.name + "/launch/" +
                    modelJson.worldNames[i] + ".launch " +
                    "~/catvehicle_ws/src/catvehicle/launch\n";

                scriptFile +=
                    "eval mv /home/reu-cat/Downloads/" + modelJson.name + "/worlds/" +
                    modelJson.worldNames[i] + ".world " +
                    "~/catvehicle_ws/src/catvehicle/worlds\n";
            }

            // TODO: implement script that runs each
            // Current script only runs first map

            /*modelJson.worldNames.forEach(){
                "worldname=" + node.worldNames[i] +".launch\n" +
                "eval cd ~\n" +
                "eval cd catvehicle_ws/src/catvehicle/launch\n" +
                "eval roslaunch catvehicle $worldname& \n" +
                "eval gzclient\n" +
                "eval ^C";
            }*/

            scriptFile += "worldname=" + modelJson.worldNames[0] +".launch\n" +
            "eval roslaunch catvehicle $worldname& \n" +
            "eval gzclient\n";

            return scriptFile;
        }

        function getReadMe(){
            var readMe = '';

            readMe +=
                "To run these: Put the worldfiles in the world folder in your ros directory,\n"+
                "put the launchfiles in the launch folder of same, and run the launch files for the" +
                "respective worldfiles to launch them. To use the bash script, you must do " +
                "\"chmod u+x script\". Please make sure you extract the entire ZIP file into the" +
                "Downloads folder. Please modify the script generated by plugin to accomodate for " +
                "user name or ROS folder location.";

            return readMe;
        }

        function getWorldFile(node){

            console.log("hit worldfile make: " + node.posModels[0]);

            var worldFile = '';

            worldFile += "<?xml version=\"1.0\" ?><sdf version=\"1.4\">\n<world name=\"default\">\n<include>\n<uri>model://ground_plane</uri>" +
        "\n</include>\n<include>\n<uri>model://sun</uri>\n</include>";

            node.models.forEach(function (data){
                worldFile += "\n<include>\n<name>"+data.name+"</name>\n<pose>"+ data.x_coord + " " + data.y_coord + " " +
                data.z_coord + " " + data.xi_coord + " " + data.yi_coord + " " + data.zi_coord + "</pose>\n<uri>model://" +
                data.name + "</uri>\n</include>";
            });

            node.planes.forEach(function (data){
                worldFile += "\n<include>\n<name>"+data.name+"</name>\n<pose>" + data.x_coord + " " + data.y_coord + " " +
                    "0 0 0 0 </pose>\n<uri>model://" + data.name + "</uri>\n</include>";
            });

            node.posModels.forEach(function (data){

                console.log("hit 2");

                worldFile += "\n<include>\n<name>"+data.name+"</name>\n<pose>" + data.x_coord + " " + data.y_coord + " " +
                    "1 0 0 " + data.yaw +  "</pose>\n<uri>model://" + data.name + "</uri>\n</include>";
            });

            // This takes all "jerWorld" objects and adds their location data to each object's data, therefore
            // translating the world accordingly.
            // NOTE: each object's data needs to be converted to float before it can be added.
            node.jerWorlds.forEach(function(data){
                worldFile += "\n" +

                    "<include>\n<name>'asphalt_plane'</name>" +
                    "<pose frame=''>" + (0+data.x_coord) + " " + (0+data.y_coord) + " 0 0 -0 0</pose>\n" +
                    "<uri>model://asphalt_plane</uri></include>\n\n" +

                    "<include><name>'bookshelf'</name>\n" +
                    "<pose>" + (2.99082 + data.x_coord)+ " " + (5.35743+data.y_coord) + " 0 0 -0 0</pose>\n" +
                    "<uri>model://bookshelf</uri></include>\n\n" +

                    "<include><name>'cardboard_box'</name>" +
                    "\n<pose frame=''>" + (2.81621+data.x_coord) + " " + (-1.77255+data.y_coord) + " 0.199 0 -0 0</pose>" +
                    "\n<uri>model://cardboard_box</uri></include>\n\n" +

                    "<include><name>'jersey_barrier'</name>" +
                    "\n<pose>" + (-9.43548+data.x_coord) + " " + (1.26022+data.y_coord) + " 0 0 0 -1.54804</pose>" +
                    "\n<uri>model://jersey_barrier</uri></include>\n\n" +

                    "<include><name>'jersey_barrier_0'</name>" +
                    "<pose frame=''>" + (-9.46749+data.x_coord) + " " + (-3.323+data.y_coord) + " 0 0 0 -1.56717</pose>" +
                    "\n<uri>model://jersey_barrier</uri></include>\n\n" +

                    "<include><name>'jersey_barrier_1'</name>\n" +
                    "<pose frame=''>" + (-9.47314+data.x_coord) + " " + (-7.77695+data.y_coord) + " 0 0 0 -1.58805</pose>" +
                    "\n<uri>model://jersey_barrier</uri></include>\n\n" +

                    "<include><name>'jersey_barrier_2'</name>" +
                    "\n<pose frame=''>"+(-9.21636+ data.x_coord) + " " + (5.7901+ data.y_coord) +
                    " 0 0 -0 1.54456</pose><uri>model://jersey_barrier</uri></include>\n\n" +

                    "<include><name>'post_office'</name>\n" +
                    "<pose frame=''>" + (6.89975+data.x_coord) +" "+ (-3.51177+data.y_coord) + " 0 0 -0 1.52992</pose>" +
                    "<uri>model://post_office</uri></include>\n\n" +

                    "<include><name>'postbox'</name>" +
                    "\n<pose>" + (0.792086+data.x_coord) + " " + (0.486382+data.y_coord) + " 0 0 -0 0</pose>" +
                    "<uri>model://postbox</uri></include>\n\n";
            });



            // Follows above example to make another world: cityBlockStraight.
            node.cityWorldSs.forEach(function(data){
                worldFile += "\n" +

                    "<include><name>'asphalt_plane'</name>\n" +
                    "<pose>" + (0+data.x_coord) + " " + (0+data.y_coord) + " 0 0 0 0</pose>" +
                    "<uri>model://asphalt_plane</uri></include>\n \n " +

                    "<include><name>'thrift_shop_1'</name>\n" +
                    "<pose>" + (7.39531+data.x_coord) + " " + (5.76837+data.y_coord) + " 0 0 0 -1.56058 </pose>" +
                    "<uri>model://thrift_shop</uri></include>\n\n" +

                    "<include><name>'thrift_shop_2'</name>\n" +
                    "<pose>" + (7.21913+data.x_coord) + " " + (-6.26468+data.y_coord) + " 0 0 0 -1.56058 </pose>" +
                    "<uri>model://thrift_shop</uri></include>\n\n" +

                    "<include><name>'prius_hybrid'</name>\n" +
                    "<pose>" + (2.6235+data.x_coord) + " " + (-7.26293+data.y_coord) + " 0 0 0 -3.11416</pose>" +
                    "<uri>model://prius_hybrid</uri></include>\n \n " +

                    "<include><name>'law_office_1'</name>\n" +
                    "<pose>" + (-7.60095+data.x_coord) + " " + (7.68313+data.y_coord) + " 0 0 0 1.58524</pose>" +
                    "<uri>model://law_office</uri></include>\n \n " +

                    "<include><name>'law_office_2'</name>\n" +
                    "<pose>" + (-7.60095+data.x_coord) + " " + (0.515447+data.y_coord) + " 0 0 0 1.58524</pose>" +
                    "<uri>model://law_office</uri></include>\n \n " +

                    "<include><name>'law_office_3'</name>\n" +
                    "<pose>" + (-7.60095+data.x_coord) + " " + (-6.21689+data.y_coord) + " 0 0 0 1.58524</pose>" +
                    "<uri>model://law_office</uri></include>\n \n " +

                    "<include><name>'asphalt_plane'</name>\n" +
                    "<pose>" + (5.15149+data.x_coord) + " " + (0.518547+data.y_coord) + " 0 0 0 -1.55167</pose>" +
                    "<uri>model://asphalt_plane</uri></include>\n \n ";

            });

            worldFile  += "\n<gui fullscreen='0'>\n<camera name='user_camera'>\n<pose>20 -20 20 0.000000 0.6 2.356190</pose>" +
                "\n<view_controller>orbit</view_controller>\n</camera>\n</gui>\n</world></sdf>";

            return worldFile;
        }


        let artifact;
    self.loadNodeMap(this.activeNode)
        .then( async function (nodes) {
            var nodePath,
                node;
            for (nodePath in nodes) {
                self.logger.info(self.core.getAttribute(nodes[nodePath], 'name'), 'has path', nodePath);
            }

            modelJson.name = core.getAttribute(activeNode, 'name');

            var childrenPaths = core.getChildrenPaths(activeNode);

            modelJson.number = childrenPaths;

            await childrenPaths.forEach(async (child) => {
                //for (var i = 0; i < 3; i += 1) {
                node = nodes[child];
                console.log("child is" + self.core.getAttribute(node, 'name'));
                // This function should add each worldfile to the modelJSON's
                // world directory.
                //await new Promise(next=>{
                //self.loadNodeMap(node, getWorlds);
                await getWorlds(node);
                console.log("hit world make: " + JSON.stringify(modelJson.worlds, null, 2),);
                //next()
                //})


            })
            await console.log("post-fn: " + JSON.stringify(modelJson.worlds, null, 2),);


            var modelJsonStr = await JSON.stringify(modelJson, null, 2);

            // Pass this information to function that returns files in ZIP.

            return await self.blobClient.putFile('modelJsonStr', modelJsonStr);

        })
        .then(async function (nodes) {

            console.log("post-then: " + JSON.stringify(modelJson.worlds, null, 2),);


            //outputting files
            self.result.addArtifact(nodes);

            // For each world file created we must create its launch file,
            // and add that information and worldfile to artifact.

            artifact = self.blobClient.createArtifact('outputFiles');

            var readMe = getReadMe();
            artifact.addFileAsSoftLink("readme.txt", readMe);

            var filesToAdd = {};

            async function getFilesToAdd() {
                var script = getScript();
                filesToAdd["script"] = script;
                for (let i = 0; i < modelJson.worlds.length; i += 1) {
                    var worldFile = modelJson.worlds[i],
                        worldName = modelJson.worldNames[i],
                        launchFile = modelJson.launchFiles[i],
                        filename = modelJson.name + '/worlds/' + worldName + '.world',
                        filename2 = modelJson.name + '/launch/' + worldName + '.launch';

                    filesToAdd[filename] = worldFile;
                    filesToAdd[filename2] = launchFile;

                }
            }


            await getFilesToAdd();

            await artifact.addFiles(filesToAdd);

            return artifact;

            //return self.blobClient.putFile(modelJson.name + '.launch', launchFile);
            //return self.blobClient.putFile(modelJson.name + '.world', worldFile);
        })
        .then(function (/* Hashes */) {
            return artifact.save();
        })
        .then(function (metadataHash) {

            self.result.addArtifact(metadataHash);
            self.result.setSuccess(true);
            callback(null, self.result);
        })
        .catch(function (err) {
            // Result success is false at invocation.
            self.logger.error(err.stack);
            callback(err, self.result);
        });


    };


    return WorldMaker;
});
