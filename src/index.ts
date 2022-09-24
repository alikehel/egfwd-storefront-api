import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import * as dotenv from "dotenv";
import cors from "cors";
import usersRoutes from "./handlers/users";
import productsRoutes from "./handlers/products";
import cookieParser from "cookie-parser";

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3000;
const address = `http://localhost:${PORT}`;

// app.use(morgan("short"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (_req: Request, res: Response) => {
    res.json({
        message: "Hello World 🌍"
    });
});

usersRoutes(app);
productsRoutes(app);

app.listen(PORT, () => {
    // console.log("🚀 ~ file: index.ts ~ line 27 ~ app.listen ~ PORT", PORT);
    console.log(`Starting APP On -> ${address}`);
});

export default app;
