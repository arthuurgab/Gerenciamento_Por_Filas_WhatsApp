const express = require('express');
const webhookQueue = require('./queue');
const app = express();
const port = 3333;

app.use(express.json());

app.get('/', (req, res) => {
    console.log('Servidor NGrok Rodando!');
    res.sendStatus(200);
});

app.post('/webhook/filas', async (req, res) => {
    try {
        await webhookQueue.add('enviarParaODataCrazy', req.body, {
            attempts: 3,
            backoff: 30000,
        });
        console.log("📥 Payload adicionado à fila");
        res.sendStatus(200);
    } catch (error) {
        console.error("❌ Erro ao adicionar na fila:", error.message);
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
