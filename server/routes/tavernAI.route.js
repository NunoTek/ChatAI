const { TavernaiApi } = require('../services/tavernAI.api');
const tavernaiApi = new TavernaiApi();

module.exports = function (router, opts, done) {
  router.get('/board', opts, async (req, res) => {
    const data = await tavernaiApi.board(req.query);
    return await res.send(data);
  });

  router.get('/categories', opts, async (req, res) => {
    const data = await tavernaiApi.listCategories(req.query);
    await res.send(data);
  });

  router.get('/categories/:name/characters', opts, async (req, res) => {
    const data = await tavernaiApi.listCategoriesCharacters(
      req.params.name,
      req.query
    );
    await res.send(data);
  });

  router.get('/characters', opts, async (req, res) => {
    const data = await tavernaiApi.listCharacters(req.query);
    await res.send(data);
  });

  router.get('/character', opts, async (req, res) => {
    const data = await tavernaiApi.getCharacterDetails(req.query);
    await res.send(data);
  });

  router.put('/character', opts, async (req, res) => {
    const data = await tavernaiApi.saveCharacterDetails(req.query, req.body);
    await res.send(data);
  });

  router.delete('/character', opts, async (req, res) => {
    await tavernaiApi.deleteCharacterDetails(req.query);
  });

  router.get('/chats', opts, async (req, res) => {
    const data = await tavernaiApi.listChats(req.query);
    await res.send(data);
  });

  router.get('/chat', opts, async (req, res) => {
    const data = await tavernaiApi.getChat(req.query);
    await res.send(data);
  });

  router.post('/chat', opts, async (req, res) => {
    await tavernaiApi.saveChat(req.query, req.body);
  });

  done();
};
