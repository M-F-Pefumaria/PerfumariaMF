const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController')
const { isAuth, isAdmin } = require('../middlewares/auth');

router.get('/', produtoController.index);
router.get('/:id', produtoController.show);
router.post('/cadastro', produtoController.create);
router.put('/:id', produtoController.update);
router.delete('/:id', produtoController.destroy);

module.exports = router;