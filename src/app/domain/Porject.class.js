import { ObjectId } from "mongodb";

export class Project {
  constructor(name, description, deadline, pk_user){
    this._id = new ObjectId();
    this.name = name;
    this.description = description;
    this.startDate = `${new Date().getDay()}/${new Date().getMonth()}/`;
    this.deadline = deadline;
    this.pk_user = pk_user;
  }
}