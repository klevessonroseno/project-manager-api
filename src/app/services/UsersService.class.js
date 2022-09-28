import * as yup from 'yup';
import { hash } from 'bcrypt';
import { repository } from '../repository/Repository.class.js';
import { EmailSender } from "./send-email/EmailSender.class.js";
import { PasswordGenerator } from './generate-password/PasswordGenerator.class.js';


export class UsersService {
  constructor(){};

  static async createOneUser(req, res) {
    try {
      const schema = yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().required(),
      });
    
      const schemaIsValid = await schema.isValid(req.body);
    
      if(!schemaIsValid) return res.status(400).json({
        message: 'Name and email are required.'
      });
    
      const { name, email } = req.body;
      const userExists =  await repository.getUserByEmail(email);
    
      if(userExists) return res.status(400).json({
        message: 'E-mail already registered. Login:',
        link: `http://localhost:${process.env.PORT}/login/`
      });
      
      const password = PasswordGenerator.generateNewPassword();
      const encryptedPassword = await hash(password, 12);
      const user = await usersRepository.createUser(name, email, encryptedPassword);
    
      if(!user) return res.status(500).json({
        message: 'Something went wrong.',
      });
      
      const [ firstName ] = user.getName().split(' ');
  
      const message = `<p>Olá, ${firstName}! Seja muito bem vindo a nossa plataforma online.<br><br> Acabamos de realizar o seu cadastro e já está tudo certo por aqui.<br><br> Para fazer login, utilize seu email e a senha:<br><br><b>${password}</b><br><br>Basta você acessar o link abaixo:<br><br>http://localhost:${process.env.PORT}/login/<br><br>Fique atento para novas atualizações que traremos pra você já nos próximos dias.<br><br> Até mais, ${firstName}!</p>`;
      
      const emailTitle = 'Boas vindas!';
      const emailSender = new EmailSender(email, emailTitle, message);

      emailSender.sendEmail();
  
     return res.status(201).json({
        message: 'User created successfully.',
        _id: user._id,
      });

    } catch (error) {
      console.error(error)
      res.status(500).json({ error });
    }
  }
  
  static async updateUserPassword(req, res) {
    try {
      const schema = yup.object().shape({
        password: yup.string().required().min(6).max(20),
        confirmPassword: yup.string().required().min(6).max(20), 
      });
    
      const schemaIsvalid = await schema.isValid(req.body);

      if(!schemaIsvalid) return res.status(400).json({
        message: 'Something went wrong with your request.'
      });

      const { password, confirmPassword } = req.body;
      const _id = req.userId;
    
      if(password !== confirmPassword) return res.status(400).json({
        message: "Passwords don't match.",
      });
    
      const encryptedPassword = await hash(password, 12);
      const user = await repository.updateUserPasswordById(_id, encryptedPassword);
    
      if(user) return res.status(200).json({ user });
    
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async recoverPassword(req, res) {
    try {
      const schema = yup.object().shape({
        email: yup.string().email().required(),
      });

      const schemaIsValid = await schema.isValid(req.body);

      if(!schemaIsValid) return res.status(400).json({
        message: 'Email is required.',
      }); 

      const { email } = req.body;
      const user = await usersRepository.getUserByEmail(email);
      
      if(!user) return res.status(404).json({
        message: 'Email not registered.'
      });

      const newPassword = PasswordGenerator.generateNewPassword();
      const newEncryptedPassword = await hash(newPassword, 12);

      const passwordUpdated = await usersRepository.updateUserPasswordById(user._id, newEncryptedPassword);

      if(!passwordUpdated) return res.status(500).json({
        message: 'Something went wrong.',
      });

      const [ firstName ] = user.name.split(' ');
      const emailText = `Olá, ${firstName}!<br><br>Aqui está a sua nova senha: <br><br>${newPassword}`;
      const emailTitle = 'Recuperação de Senha';
      const emailSender = new EmailSender(email, emailTitle, emailText);

      emailSender.sendEmail();

      res.status(204).json({
        message: 'Updated email.',
      });
  
    } catch (error) {
      
    }
  }

  static async createNewProjectByUserId(req, res) {
    const {name, description, deadline} = req.body;
    const {userId} = req;

    const userFound = await repository
      .createNewProjectsByUserId(name, description, deadline, userId);

    if(userFound) return res.status(200).json({ userFound });

    res.status(500).json({message: 'Error on server'});
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