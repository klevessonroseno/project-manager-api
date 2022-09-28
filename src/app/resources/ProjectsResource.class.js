import express from 'express';
import { ProjectsService } from '../services/ProjectsService.class.js';
import { UserSessionsService } from '../services/UserSessionsService.class.js';
import { UsersService } from '../services/UsersService.class.js'

class ProjectsResource {
  constructor() {
    this.router = express.Router();

    this.createOneProject();
    this.getAllProjects();
  }

  async createOneProject(req, res) {
    this.router.post('/projects/', 
      UserSessionsService.validateUserSession, 
      UsersService.createNewProjectByUserId
    );
  }
  
  async getAllProjects(req, res){
    this.router.get('/projects/',
      UserSessionsService.validateUserSession, 
      UsersService.getAllProjects
    );
  }
}

export default new ProjectsResource().router;