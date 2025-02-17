const redis = require("redis");
const { SQS } = require("aws-sdk");
require("dotenv").config();

const client = redis.createClient({ url: process.env.REDIS_URL });
const sqs = new SQS({ region: process.env.AWS_REGION });

async function publishMessage(data) {
    if (process.env.USE_SQS === "true") {
        const params = {
            MessageBody: JSON.stringify(data),
            QueueUrl: process.env.SQS_URL,
        };
        await sqs.sendMessage(params).promise();
    } else {
        await client.publish("userChannel", JSON.stringify(data));
    }
}

module.exports = publishMessage;