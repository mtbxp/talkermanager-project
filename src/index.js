const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const generateToken = require('./middlewares/generateToken');
const validEmail = require('./middlewares/validEmail');
const validPassword = require('./middlewares/validPassword');
const validToken = require('./middlewares/validToken');
const validName = require('./middlewares/validName');
const validAge = require('./middlewares/validAge');
const validWatchedAt = require('./middlewares/validWatchedAt');
const validRate = require('./middlewares/validRate');
const validTalk = require('./middlewares/validTalk');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_req, res) => {
  res.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

const talkerPath = path.resolve(__dirname, './talker.json');

app.get('/talker', async (_req, res) => {
  const talker = JSON.parse(await fs.readFile(talkerPath, 'utf8'));
  return res.status(HTTP_OK_STATUS).json(talker);
});

app.get('/talker/search', validToken, async (req, res) => {
  const { q } = req.query;

  const allTalkers = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));

  const filterTalker = allTalkers.filter((talker) => talker.name.includes(q));

  res.status(HTTP_OK_STATUS).json(filterTalker);
});  

app.get('/talker/:id', async (req, res) => {
  const talkers = JSON.parse(await fs.readFile(talkerPath, 'utf8'));
  const talkerFind = talkers.find(({ id }) => id === Number(req.params.id));

  return !talkerFind ? (
    res.status(404).send({ message: 'Pessoa palestrante não encontrada' })) 
    : res.status(HTTP_OK_STATUS).json(talkerFind);
});

app.post('/login', validEmail, validPassword, (_req, res) => {
  const token = generateToken();

  res.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker',
  validToken,
  validName,
  validAge,
  validTalk,
  validWatchedAt,
  validRate,
  async (req, res) => {
    const allTalkers = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
    const addTalker = allTalkers.length + 1;
    const body = { id: addTalker, ...req.body };

    allTalkers.push(body);    
    await fs.writeFile(talkerPath, JSON.stringify(allTalkers));
    res.status(201).json(body);
  });

app.put(
  '/talker/:id',
  validToken,
  validName,
  validAge,
  validTalk,
  validWatchedAt,
  validRate,
  async (req, res) => {
    const id = Number(req.params.id);
    const editTalker = { id, ...req.body };
    const allTalkers = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
    const index = allTalkers.findIndex((talkerIndex) => talkerIndex.id === Number(id));

    allTalkers[index] = editTalker;
    await fs.writeFile(talkerPath, JSON.stringify(allTalkers));
    res.status(HTTP_OK_STATUS).json(editTalker);
  },
);

app.delete('/talker/:id', validToken, async (req, res) => {
  const { id } = req.params;
  const allTalkers = JSON.parse(await fs.readFile(talkerPath, 'utf-8'));
  const deleteTalker = allTalkers.find((talker) => talker.Id !== +id);
  await fs.writeFile(talkerPath, JSON.stringify(deleteTalker));
  res.status(204).end();
});
