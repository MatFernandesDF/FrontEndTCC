export function controleAcesso(nivelNecessario) {
  return (req, res, next) => {
    const { usuario } = req;

    if (usuario && usuario.nivelAcesso === nivelNecessario) {
      return next();
    } else {
      return res.status(403).send('Acesso negado');
    }
  };
}