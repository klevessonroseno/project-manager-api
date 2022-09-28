import { UserSessionsService } from '../services/UserSessionsService.class.js';
import express from 'express';

class UserSessionsResource {
  constructor() {
    this.router = express.Router();

    this.createUserSession();
  }

  async createUserSession(){
    this.router.post('/session', UserSessionsService.createUserSession);
  }
}

export default new UserSessionsResource().router;