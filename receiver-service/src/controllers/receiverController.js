const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");
const publishMessage = require("../services/publisher");

const userSchema = Joi.object({
    user: Joi.string().required(),
    class: Joi.string().required(),
    age: Joi.number().integer().required(),
    email: Joi.string().email().required(),
});

exports.receiveData = async(req, res) => {
    try {
        const { error, value } = userSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const newUser = await User.create({ id: uuidv4(), ...value });

        // Publish event to Redis or SQS
        await publishMessage(newUser);

        res.status(201).json({ message: "Data received & published.", data: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};