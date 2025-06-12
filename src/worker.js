const { Worker } = require('bullmq');
const axios = require('axios');
const IORedis = require('ioredis'); 
require('dotenv').config();

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const worker = new Worker('webhookQueue', async (job) => {
    const body = job.data;

    const dataSend = {
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
    };

    try {
        const response = await axios.post(process.env.DATA_CRAZY_URL, dataSend, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("✔️ Dados enviados com sucesso:", response.status);
    } catch (err) {
        console.error("❌ Falha ao enviar para o Data Crazy:", err.message);
    }
}, {
    connection,
    concurrency: 3,
})