import { ObjectId } from "mongodb";

export class User {
  constructor(name, email, password){
    this._id = new ObjectId();
    this.name = name;
    this.email = email;
    this.password = password;
  }
  getUserId(){
    return this._id;
  }
  getName(){
    return this.name;
  }
  setName(name){
    this.name = name;
  }
  getEmail(){
    return this.email;
  }
  setEmail(email){
    this.email = email;
  }
  getPassword(){
    return this.password;
  }
  setPassword(password){
    this.password = password;
  }
};