const {Worker} = require('bullmq');

const worker = new Worker('webhook-queue', async (job) => {
    const webhookData = job.data;
    console.log('Processando dados do webhook:', webhookData);
}, {
    connection: {
        host: 'localhost',
        port: 6379,
    }
});

worker.on('completed', (job) => {
    console.log(`Job ${job.id} concluído`);
});

worker.on('failed', (job, err) => {
    console.log(`Job ${job.id} falhou com o erro ${err}`);
});