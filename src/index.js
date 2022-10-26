const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const generateToken = require('./middlewares/generateToken');
const validEmail = require('./middlewares/validEmail');
const validPassword = require('./middlewares/validPassword')

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_req, res) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

const pathTalker = path.resolve(__dirname, './talker.json');

app.get('/talker', async (req, res) => {
  const talker = JSON.parse(await fs.readFile(pathTalker, 'utf8'));
  return res.status(HTTP_OK_STATUS).json(talker);
});

app.get('/talker/:id', async (req, res) => {

  const talker = await fs.readFile('./talker.json', 'utf-8');
  const talkerparsed = JSON.parse(talker);

  console.log(talkerparsed);

  const { id } = req.params;
  const talkerFiltered = talkerparsed.filter((talkerObject) => talkerObject.id === Number(id));

  return talkerFiltered && talkerFiltered.length > 0 ? (
    res.status(200).send(talkerFiltered[0])) : (
      res.status(404).send({ message: 'Pessoa palestrante não encontrada' }));
});


app.post('/login', validEmail, validPassword, (_req, res) => {
  const token = generateToken();

  res.status(HTTP_OK_STATUS).json({ token });
});
