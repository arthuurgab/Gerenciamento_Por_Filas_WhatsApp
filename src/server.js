const express = require('express');
const { Queue } = require('bullmq');
const axios = require('axios');

const app = express();
const port = 3333;

const DATA_CRAZY_URL = 'https://api.datacrazy.io/v1/crm/api/crm/integrations/webhook/business/f8d6f7d8-2928-4514-b016-fceff8339a0f';
app.use(express.json());

app.get('/', (req, res) => {
    console.log('Servidor NGrok Rodando!');
    res.sendStatus(200);
});

app.post('/webhook/filas', async (req, res) => {
    const body = req.body;
    let messageContextInfo = {};

    dataSend = {
        "event": body.event,
        "instance": body.instance,
        "data": {
            "key": {
                "remoteJid": body.data?.key?.remoteJid || '',
                "fromMe": body.data?.key?.fromMe || false,
                "id": body.data?.key?.id || ''
            },
            "name": body.data?.pushName,
            "status": body.data?.status,
            "message": {
                "conversation": body.data?.message?.conversation || '',
                "messageContextInfo": {
                    "deviceListMetadata": {
                        "senderKeyHash": body.data?.message?.messageContextInfo?.deviceListMetadata?.senderKeyHash,
                        "senderTimestamp": body.data?.message?.messageContextInfo?.deviceListMetadata?.senderTimestamp,
                        "recipientKeyHash": body.data?.message?.messageContextInfo?.deviceListMetadata?.recipientKeyHash,
                        "recipientTimestamp": body.data?.message?.messageContextInfo?.deviceListMetadata?.recipientTimestamp,
                    },
                    "deviceListMetadataVersion": body.data?.message?.messageContextInfo?.deviceListMetadataVersion || '',
                    "messageSecret": body.data?.message?.messageContextInfo?.messageSecret || '',
                },
            },       
            "messageType": body.data?.messageType,
            "messageTimestamp": body.data?.messageTimestamp,
            "instanceId": body.data?.instanceId,
            "source": body.data?.source
        },
        "destination": body.destination,
        "date_time": body.date_time,
        "sender": body.sender,
        "server_url": body.server_url,
        "apikey": body.apikey,
       
    }
    try {
        const resposta = await axios.post(DATA_CRAZY_URL, dataSend, {
            headers: { 'Content-Type': 'application/json' }
        })
        console.log("✔️ Enviando com sucesso para o Data Crazy", resposta.status);
        res.sendStatus(200);
    } catch (err) {
        console.log("❌ Erro ao enviar ao Data Crazy:", err.message)
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
