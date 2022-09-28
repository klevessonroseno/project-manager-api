export class PasswordGenerator {
  constructor(){};

  static generateNewPassword(){
    return Math.random().toString(36).slice(-8);
  }
}