const { Worker } = require('bullmq');
const axios = require('axios');
const IORedis = require('ioredis'); 
require('dotenv').config();

async function enviarParaODataCrazy(dataSend) {
    try {
        const response = await axios.post(process.env.DATA_CRAZY_URL, dataSend, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("✔️ Dados enviados com sucesso:", response.status);
    } catch (err) {
        console.error("❌ Falha ao enviar para o Data Crazy:", err.message);
    }
}

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const workerMessageUpsert = new Worker('webhookQueue', async (job) => {
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
    enviarParaODataCrazy("workerMessageUpsert: ", dataSend)
}, {
    connection,
    concurrency: 3,
})

const workerContactsUpdate = new Worker('webhookQueueContactsUpdate', async (job) => {
    const body = job.data;
    const dataSend = {
        "event": body.event,
        "instance": body.instance,
        "data": {
            "remoteJid": body.data?.remoteJid,
            "pushName": body.data?.pushName,
            "profilePicUrl": body.data?.profilePicUrl,
            "instanceId": body.data?.instanceId
        },
        "destination": body.destination,
        "date_time": body.date_time,
        "sender": body.sender,
        "server_url": body.server_url,
        "apikey": body.apikey
    };
    enviarParaODataCrazy("workerContactsUpdate: ", dataSend)
}, {
    connection,
    concurrency: 3,
})

const workerMessagesUpdate = new Worker('webhookQueueMessageUpdate', async (job) => {
    const body = job.data;
    const dataSend = {
        "event": body.event,
        "instance": body.instance,
        "data": {
            "messageId": body.data.messageId,
            "keyId": body.data.keyId,
            "remoteJid": body.data.remoteJid,
            "fromMe": body.data.fromMe,
            "participant": body.data.participant,
            "status": body.data.status,
            "instanceId": body.data.instanceId
        },
        "destination": body.destination,
        "date_time": body.date_time,
        "sender": body.sender,
        "server_url": body.server_url,
        "apikey": body.apikey
    };
    enviarParaODataCrazy("workerMessagesUpdate: ", dataSend)
}, {
    connection,
    concurrency: 3,
})