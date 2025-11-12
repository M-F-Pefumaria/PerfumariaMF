function isAuth(req, res, next) {
    if (req.session.usuarioLogado) {
        next();
    } else {
        return res.status(401).json({ message: 'Não autorizado. Por favor, faça o login.' });
    }
};

function isAdmin(req, res, next) {
    if (req.session.usuarioLogado && req.session.usuarioLogado.tipo === 'ADMIN') {
        next();
    } else {
        return res.status(403).json({ message: 'Acesso restrito. Requer privilégios de administrador.' });
    }
}
module.exports = {isAuth, isAdmin};