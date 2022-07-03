export default async function validateUser (req, res, next) {
    try {
        const { authorization } = req.headers;
        const token = authorization?.replace('Bearer', '').trim();
        if (!token) {
            return res.sendStatus(401);
        }
        next();
    } catch (err) {
        res.status(500).send('Algo deu errado. Tente novamente!');
    }
}