import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import { EmailConfig } from '../../../config/EmailConfig.class.js';

config();

export class EmailSender extends EmailConfig {
  constructor(sendTo, title, text) {
    super(sendTo, title, text);
  }  
  sendEmail(){
    this.transporter.sendMail(this.mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }
}