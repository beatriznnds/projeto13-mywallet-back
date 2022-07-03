import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import authRouter from './routes/authRouter.js';
import entriesRouter from './routes/entriesRouter.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(entriesRouter);

const PORT = process.env.PORT;
app.listen(PORT);