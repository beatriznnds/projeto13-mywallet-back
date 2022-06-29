import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { userSchema, newUserSchema,  entrySchema } from './validations.js';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;


mongoClient.connect().then(() => {
	db = mongoClient.db(process.env.MONGO_DATABASE);
});

app.post('/signup',  async (req, res) => {
    const user = req.body;
    const { error } = newUserSchema.validate(user);
    if (error) {
        return res.sendStatus(422);
    }
    try {
        const encryptedPassword = bcrypt.hashSync(user.password, 10);
        await db.collection('users').insertOne({ ...user, password: encryptedPassword });
        res.status(201).send('Usuário criado com sucesso!')
    } catch (err) {
        res.status(500).send('Preencha novamente os dados!')
    }
})

const PORT = process.env.PORT;
app.listen(PORT);