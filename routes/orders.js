const express = require("express");
const router = express.Router();
const controller = require('../controllers/ordersController');



router.get('/', controller.get_main);

router.post('/', controller.post);

router.get('/:orderId', controller.get_id);

router.delete('/:orderId', controller.delete);

module.exports = router;