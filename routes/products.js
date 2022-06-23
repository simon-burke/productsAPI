const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController')
router.get('/', controller.get_main);

router.post('/', controller.post);

router.get('/:productId', controller.get_id);

router.delete('/:productId', controller.delete);
router.patch('/:productId', controller.patch);

module.exports = router;