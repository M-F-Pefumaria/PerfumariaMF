const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController')
const {isAuth} = require('../middlewares/auth');

router.post('/', isAuth, enderecoController.create);
router.get('/', isAuth, enderecoController.index);
router.get('/:id', enderecoController.show);
router.put('/:id', isAuth, enderecoController.update);
router.delete('/:id', isAuth, enderecoController.destroy);

module.exports = router;