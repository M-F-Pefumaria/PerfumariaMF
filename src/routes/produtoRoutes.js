const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController')
const { isAuth, isAdmin } = require('../middlewares/auth');

router.get('/', isAuth, produtoController.index);
router.get('/:id', isAuth, produtoController.show);
router.post('/cadastro', isAuth, isAdmin, produtoController.create);
router.put('/:id', isAuth, isAdmin, produtoController.update);
router.delete('/:id', isAuth, isAdmin, produtoController.destroy);

module.exports = router;