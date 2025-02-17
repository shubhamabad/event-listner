const redis = require("redis");
const { SQS } = require("aws-sdk");
const UserHistory = require("../models/userHistoryModel");

const client = redis.createClient({ url: process.env.REDIS_URL });
const sqs = new SQS({ region: process.env.AWS_REGION });

async function processMessage(data) {
    const modified_at = new Date();
    await UserHistory.create({...data, modified_at });
}

async function subscribeToQueue() {
    if (process.env.USE_SQS === "true") {
        const params = { QueueUrl: process.env.SQS_URL, MaxNumberOfMessages: 10 };

        setInterval(async() => {
            const messages = await sqs.receiveMessage(params).promise();
            if (messages.Messages) {
                for (const msg of messages.Messages) {
                    await processMessage(JSON.parse(msg.Body));
                    await sqs.deleteMessage({ QueueUrl: process.env.SQS_URL, ReceiptHandle: msg.ReceiptHandle }).promise();
                }
            }
        }, 5000);
    } else {
        client.subscribe("userChannel");
        client.on("message", async(_, message) => {
            await processMessage(JSON.parse(message));
        });
    }
}

subscribeToQueue();