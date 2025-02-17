const { Pool } = require('pg');
        const AWS = require('aws-sdk');
        require('dotenv').config();

        const pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASS,
            port: process.env.DB_PORT,
        });

        AWS.config.update({ region: process.env.AWS_REGION });
        const sqs = new AWS.SQS();
        const QUEUE_URL = process.env.SQS_QUEUE_URL;

        async function processMessages() {
            const params = { QueueUrl: QUEUE_URL, MaxNumberOfMessages: 1, WaitTimeSeconds: 10 };

            try {
                const data = await sqs.receiveMessage(params).promise();
                if (!data.Messages) return;

                for (const message of data.Messages) {
                    const record = JSON.parse(message.Body);
                    const modifiedAt = new Date().toISOString();

                    await pool.query(
                        'INSERT INTO second_table (id, user, class, age, email, inserted_at, modified_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                        [record.id, record.user, record.userClass, record.age, record.email, record.insertedAt, modifiedAt]
                    );

                    await sqs.deleteMessage({ QueueUrl: QUEUE_URL, ReceiptHandle: message.ReceiptHandle }).promise();
                }
            } catch (error) {
                console.error('Error processing messages:', error);
            }
        }

        setInterval(processMessages, 5000);