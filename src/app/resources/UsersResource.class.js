import express from 'express';
import { UsersService } from '../services/UsersService.class.js';
import { UserSessionsService } from '../services/UserSessionsService.class.js';

class UsersResource {
  constructor() {
    this.router = express.Router();
    
    this.createOneUser();
    this.updateUserPassword();
    this.recoverPassword();
  }

  createOneUser() {
    this.router.post('/user/', UsersService.createOneUser);
  }

  updateUserPassword() {
    this.router.put('/user/password/', UserSessionsService.validateUserSession, UsersService.updateUserPassword);
  }

  recoverPassword() {
    this.router.put('/user/recover_password/', UsersService.recoverPassword);
  }
}
export default new UsersResource().router;