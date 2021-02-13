const Users = require('../models/index');

const authAdmin = async (req, res, next) => {
    try {
        const user = await Users.findOne({_id: req.user.id});

        if(user.role !== 1) 
            return res.status(500).json({msg: "You do not have administrator access!!"});

        next();
    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
}

module.exports = authAdmin;