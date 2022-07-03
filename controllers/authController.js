import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { db, objectId } from '../dbStrategy/mongo.js';
import { userSchema, newUserSchema } from '../validations.js';

export async function createUser(req, res) {
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
}

export async function getUser (req, res) {
    const user = req.body;
    const { error } = userSchema.validate(user);
    if (error) {
        return res.sendStatus(422);
    }
    try {
        const oldUser = await db.collection('users').findOne({ email: user.email });
        const checkPassword = bcrypt.compareSync(user.password, oldUser.password);
        if (!oldUser || !checkPassword) {
            return res.status(404).send('Email ou senha incorretos!')
        }
        const token = uuid();
        await db.collection('onlineUsers').insertOne({ token, userId: new objectId(oldUser._id)});
        res.status(201).send({ token, name: oldUser.name });
    } catch (err) {
        console.log(err)
        res.status(500).send('Algo deu errado. Tente novamente!');
    }
}