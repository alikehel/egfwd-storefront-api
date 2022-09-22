import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import * as dotenv from 'dotenv';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3000;
const address = `http://localhost:${PORT}`;

app.use(morgan('short'));
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Hello World 🌍'
    });
});

app.listen(PORT, () => {
    console.log(`Starting APP On -> ${address}`);
});
