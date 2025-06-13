const express = require('express');
const webhookQueue = require('./filas/queue');
const webhookQueueContactsUpdate = require('./filas/queueContactsUpdate');
const webhookQueueMessageUpdate = require('./filas/queueMessageUpdate');
const webhookQueueContactsUpsert = require('./filas/queueContactsUpsert');
const app = express();
const port = 3333;

app.use(express.json());

app.get('/', (req, res) => {
    console.log('Servidor NGrok Rodando!');
    res.sendStatus(200);
});

app.post('/webhook/filas', async (req, res) => {
    const body = req.body;

    // Messages
    if (body.event === 'messages.update') {
        try {
            await webhookQueueMessageUpdate.add('enviarParaODataCrazy', req.body, {
                attempts: 3,
                backoff: 30000,
            });
            console.log("Messages Update adicionado à fila!");
            return res.sendStatus(200);
        } catch (error) {
            console.error("❌ Erro ao adicionar na fila:", error.message);
            return res.sendStatus(500);
        }
    }

    if (body.event === 'messages.upsert') {
        try {
            await webhookQueue.add('enviarParaODataCrazy', req.body, {
                attempts: 3,
                backoff: 30000,
            });
            console.log("Messages Upsert adicionado à fila!");
            return res.sendStatus(200);
        } catch (error) {
            console.error("❌ Erro ao adicionar na fila:", error.message);
            return res.sendStatus(500);
        }
    }

    // Contacts
    if (body.event === 'contacts.update') {
        try {
            await webhookQueueContactsUpdate.add('enviarParaODataCrazy', req.body, {
                attempts: 3,
                backoff: 30000,
            });
            console.log("Contacts Update adicionado à fila!");
            return res.sendStatus(200);
        } catch (error) {
            console.error("❌ Erro ao adicionar na fila:", error.message);
            return res.sendStatus(500);
        }
    }

    if (body.event === 'contacts.upsert') {
        try {
            await webhookQueueContactsUpsert.add('enviarParaODataCrazy', req.body, {
                attempts: 3,
                backoff: 30000,
            });
            console.log("Contacts Upsert adicionado à fila!");
            return res.sendStatus(200);
        } catch (error) {
            console.error("❌ Erro ao adicionar na fila:", error.message);
            return res.sendStatus(500);
        }
    }

    console.log("Evento não tratado:", body.event);
    return res.sendStatus(400);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
