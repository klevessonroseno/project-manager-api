import express from 'express';
import usersResource from './app/resources/UsersResource.class.js';
import userSessionResource from './app/resources/UserSessionsResource.class.js';
import projectsResources from './app/resources/ProjectsResource.class.js';

class ProjectManagerApplication {
  constructor() {
    this.server = express();
    
    this.useMiddlewares();
    this.useResources();
  }

  useMiddlewares() {
    this.server.use(express.json());
  }

  useResources(){
    this.server.use(usersResource);
    this.server.use(userSessionResource);
    this.server.use(projectsResources);
  }
}
export default new ProjectManagerApplication().server;