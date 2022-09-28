import { repository } from '../repository/Repository.class.js';
import * as yup from 'yup';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export class UserSessionsService {
  constructor(){}

  static async createUserSession(req, res) {
    try {
      
      const schema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required().min(6).max(20),
      });
    
      const schemaIsValid = await schema.isValid(req.body);
    
      if(!schemaIsValid) return res.status(400).json({
        message: 'Email and password are required.'
      });
  
      const { email, password } = req.body;
      const user = await repository.getUserByEmail(email);
  
      if(!user) return res.status(404).json({
        message: 'There is no user registered with this email. Register using the link below:',
        link: `http://localhost:${process.env.PORT}/user`,
      });
  
      const checkPassword = await compare(password, user.password);
  
      if(!checkPassword) return res.status(400).json({
        message: 'Incorrect password.'
      });
  
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
        },
        process.env.SECRET,
        {
          expiresIn: '1d',
        }
      );
      
      res.status(200).json({ message: `Authenticated user.`, token });
  
    } catch (error) {
      console.error({ error });
      res.status(500).json(error);
    }
  }

  static async validateUserSession(req, res, next) {
    
    const authHeader = req.headers.authorization;

    if(!authHeader) return res.status(401).json({
      error: 'Token not provided'
    });

    const [, token] = authHeader.split(' ');
  
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

    req.userId = decoded._id;

    return next();

    }catch (error) {
      return res.status(401).json({ error: 'Token invalid' });
    }
  }
}