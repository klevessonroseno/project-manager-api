import server from './ProjectManagerApplication.class.js';
import { config } from 'dotenv';

config();

const port = process.env.PORT;

server.listen(port, () => console.log(`App is running at port ${port}`));