const massRegistry = require('../models/index');

exports.getAll = async (req, res) => {
    try {
        const registry = await massRegistry.find();
        res.status(200);
        res.send(registry);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

exports.postOne = async (req, res) => {
    try {
        const { name, date, members, time } = req.body;
        const registerOne = await massRegistry.create({ name, date, members, time });
        res.status(201);
        res.send(registerOne);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

