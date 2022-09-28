import { repository } from '../repository/Repository.class.js';

export class ProjectsService {
  constructor() {}

  static async createOneProject(req, res){
    const { name, description, deadline } = req.body;
    const { userId } = req;
    const projectCreated = await repository
      .createOneProject(name, description, deadline, userId);
    
    if(projectCreated) return res.status(201).json({
      projectCreated
    });

    return res.status(500).json({
      message: 'Something went wrong.'
    });
  }

  static async getAllProjects(req, res){
    const { userId } = req;
    const allProjects = await repository.getAllProjectsByUserId(userId);

    if(!allProjects) return res.status(404).json({
      message: 'There are no projects registered by this user yet.'
    });

    res.status(200).json(allProjects);
  }
}