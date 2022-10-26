const validEmail = (req, res, next) => {
  const { email } = req.body;
  const regexEmail = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

  if (email === undefined) {
    res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!email.match(regexEmail)) {
    res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  return next();
};

module.exports = validEmail;
