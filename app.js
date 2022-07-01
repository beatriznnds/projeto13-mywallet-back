import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import dayjs from 'dayjs';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { userSchema, newUserSchema, entrySchema } from './validations.js';

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
});

app.post('/login', async (req, res) => {
    const user = req.body;
    const { error } = userSchema.validate(user);
    if (error) {
        return res.sendStatus(422);
    }
    try {
        const oldUser = await db.collection('users').findOne({ email: user.email });
        console.log(oldUser._id)
        const checkPassword = bcrypt.compareSync(user.password, oldUser.password);
        if (!oldUser || !checkPassword) {
            return res.status(404).send('Email ou senha incorretos!')
        }
        const token = uuid();
        await db.collection('onlineUsers').insertOne({ token, userId: new ObjectId(oldUser._id)});
        res.status(201).send('Usuário logou com sucesso!');
    } catch (err) {
        res.status(500).send('Algo deu errado. Tente novamente!');
    }
});

app.get('/entries', async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '');
    try {
        const offline = await db.collection('onlineUsers').findOne({ token });
        if (offline) {
            return res.sendStatus(401);
        }
        const entries = await db.collection('entries').find({ token }).toArray();
        const reverseEntries = entries.reverse();
        res.send(reverseEntries);
    } catch (err) {
        res.status(500).send('Algo deu errado. Tente novamente!');
    }
});

app.post('/entries', async (req, res) => {
    const entry = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '');

    const { error } = entrySchema.validate(entry);
    if (error) {
        return res.sendStatus(422);
    }

    try {
        const offline = await db.collection('onlineUsers').findOne({ token });
        if (offline) {
            return res.sendStatus(401);
        }
        await db.collection('entries').insertOne({ token, value: entry.value, description: entry.description, type: entry.type, date: dayjs().format('DD/MM') })
        console.log({ token, value: entry.value, description: entry.description, type: entry.type, date: dayjs().format('DD/MM') })
        res.status(201).send('Movimentação registrada com sucesso!');
    } catch (err) {
        res.status(500).send('Algo deu errado. Tente novamente!');
    }

})

const PORT = process.env.PORT;
app.listen(PORT);