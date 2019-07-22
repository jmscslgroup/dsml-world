// script.cpp
// by alex pyryt
// a program that accepts a string as an input and,
// if that name matches a model file in the model library,
// produces a gazebo world file with that model in it. 

#include <iostream>
#include <fstream>
using namespace std;

int main()
{
string modelName = "";
string xVal = "";
string yVal = "";
string zVal = "";
int numModels = 0;
cout << "Welcome to Alex's super cool gazebo worldmaker!" << endl;
cout << "WARNING: Only works with models that have no innate <pose>!" << endl;
cout << "How many models?" << endl;
cin >> numModels;

ofstream gazWorld;
ifstream gaz1;
ifstream gaz2;
ifstream model;
ifstream model2;


// open our world file and clear it

gazWorld.open("gazebo.world", ofstream::out | ofstream::trunc);
cout << "Opened gazebo worldfile" << endl;


gaz1.open("gazebo1.txt");
string copy1 = "";
for(int i=0 ; gaz1.eof()!=true ; i++)   // copy all of contents to placeholder string
{
    copy1 += gaz1.get();
}
copy1.erase(copy1.end()-1);     // erase last character
gazWorld << copy1;
gaz1.close();

cout << "Copied gazebo1.txt" << endl;

for(int i = 0; i < numModels; i++)
{
cout << "What is the name of the model?" << endl;
cin >> modelName;
cout << "What is x-coordinate?" << endl;
cin >> xVal;
cout << "What is y-coordinate?" << endl;
cin >> yVal;
cout << "What is z-coordinate?" << endl;
cin >> zVal;

// This address should be set to wherever you store the models on your computer.
model.open("/home/reu-cat/dsml-world/models/gazebo_models/"+modelName+"/model.sdf");
if (model.is_open())
  cout << "Model successful" << endl;
  else
    {
    cout << "Model does not exist." << endl;
    return 0;
    }
string copy2 = "";
string add = "";
bool addPos = false;
int inputLength = 0;
for(int i=0 ; model.eof()!=true ; i++){
    // We want to skip the first two lines, which are 45 char. 
    if(i>44)
        {   
        add = model.get();
        copy2 += add; 
        }
    else
        model.get();
                
    if(add == "\n" && addPos != true)
    // We want to add the position location after the first line. 
        {
        string add2 = "<pose frame=''>"+xVal + " " + yVal + " " + zVal + " " + "-0 0 0</pose>\n";
        copy2+=add2;
        addPos = true;    
        }
    }
// at the end there is "</sdf>", which we do not want
for(int i = 0; i <= 7; i ++)
    copy2.erase(copy2.end()-1);
    
gazWorld << copy2;
model.close();
}

cout << "Copied model info" << endl;

gaz2.open("gazebo2.txt");
string copy3 = "";
for(int i=0 ; gaz2.eof()!=true ; i++)   // copy all of contents to placeholder string
    copy3 += gaz2.get();
copy3.erase(copy3.end()-1);     // erase last character
gazWorld << copy3;
gaz2.close();

cout << "Copied gazebo2.txt" << endl;

gazWorld.close();

cout << "Done! Now run \" gazebo gazebo.world \" to see your world!" << endl;

return 0;
}
