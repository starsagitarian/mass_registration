const router = require('express').Router();
const controller = require('../controller/registration');

router.get('/events', controller.getAll);
router.post('/events', controller.postOne);

module.exports = router;
