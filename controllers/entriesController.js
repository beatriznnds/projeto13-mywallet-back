import { db, objectId } from '../dbStrategy/mongo.js'
import { entrySchema  } from '../validations.js';
import dayjs from "dayjs";

export async function getEntries (req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    try {
        const session = await db.collection("onlineUsers").findOne({ token });
        if (!session) {
            return res.sendStatus(401);
        }
        const entries = await db.collection('entries').find({userId: session.userId}).toArray();
        const reverseEntries = entries.reverse();
        res.send(reverseEntries);
    } catch (err) {
        res.status(500).send(err);
    }
}

export async function makeEntry (req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    const entry = req.body;   
    const { error } = entrySchema.validate(entry);
    if (error) {
        return res.sendStatus(422);
    }
    try {
        const session = await db.collection('onlineUsers').findOne({ token });
        await db.collection('entries').insertOne({ userId: session.userId, value: entry.value, description: entry.description, type: entry.type, date: dayjs().format('DD/MM') })
        res.status(201).send('Movimentação registrada com sucesso!');
    } catch (err) {
        res.status(500).send('Algo deu errado. Tente novamente!');
    }
}