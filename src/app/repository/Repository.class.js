import { ObjectId } from "mongodb";
import { DatabaseConfig } from '../../config/DatabaseConfig.class.js';
import { User } from "../domain/User.class.js";

class Repository extends DatabaseConfig {
  constructor(){
    super();
    this.users = this.database.collection('users');
    this.projects = this.database.collection('projects');
  }
 
  async getUserById(userId){
    const _id = userId;
    const query = {_id: new ObjectId(`${_id}`)}
    const user = await this.users.findOne(query);

    if(user) return user;
    
    return null;
  }

  async getUserByEmail(email){
    const user = await this.users.findOne({ email });

    if(user) return user;

    return null;
  }

  async getAllUsers(){
    return await this.users.find({}).toArray();
  }
  
  async createUser(name, email, password){
    const user = new User(name, email, password);
    const userCreated = await this.users.insertOne(user);

    if(userCreated.acknowledged) return user;

    return null;
  }
  
  async updateUserPasswordById(_id, newPassword){
    const query = { _id: new ObjectId(`${_id}`) };
    const newValues = { $set: { password: newPassword } };

    const passwordUpdated = await this.users.updateOne(query, newValues);

    if(passwordUpdated) return passwordUpdated;

    return null;
  }

  async createNewProjectsByUserId(name, description, deadline, userId){
    const projectCreated = await this.projects.insertOne({
      name,
      description,
      deadline,
      userId,
    })

    if(projectCreated.acknowledged) {
      const _id = projectCreated.insertedId;
      return await this.projects.findOne({_id: new ObjectId(`${_id}`)});
    }
    return null;
  }
  async getAllProjectsByUserId(_id){
    //const query = { _id: new ObjectId(`${_id}`) }; 
    const allProjects = await this.projects.find( /*query*/ );
    return allProjects;
  }
}

export const repository = new Repository();
