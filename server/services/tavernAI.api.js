const fs = require('fs');

const env = require('../settings.json');
const useHttp = require('./http');

const host = env.SERVER_TAVERNAI_URL ?? 'https://tavernai.net';
const server = `${host}/api`;

const chatPath = (user_name = null, public_id_short = null) => {
  const path = require('path');
  const destPath = path.join('db', 'chats');
  if (!user_name || !public_id_short) {
    return destPath;
  }

  const fileName = `${user_name}-${public_id_short}.json`;
  const filePath = path.join(destPath, fileName);
  return filePath;
};

const characterPath = (
  user_name = null,
  public_id_short = null,
  extension = null
) => {
  const path = require('path');
  if (!user_name) {
    return path;
  }

  const destPath = path.join('public', 'characters', user_name);
  if (!public_id_short) {
    return destPath;
  }

  const fileName = `${public_id_short}.${extension}`;
  const filePath = path.join(destPath, fileName);
  return filePath;
};

const characterAvatarRoute = (user_name, public_id_short) => {
  const env = require('../settings.json');

  const extension = 'webp';
  const remoteUrl = `${host}/${user_name}/${public_id_short}.${extension}`;
  const filePath = characterPath(user_name, public_id_short, extension);
  const localUrl = `${env.SERVER_BASE_URL}/static/characters/${user_name}/${public_id_short}.${extension}`;
  return fs.existsSync(filePath) ? localUrl : remoteUrl;
};

const formatCharacter = (c) => {
  return {
    ...c,
    name: c.name,
    avatar: characterAvatarRoute(c.user_name, c.public_id_short),
    description:
      c.description && c.description !== ''
        ? c.description
        : c.short_description,
    short_description: undefined,
  };
};

const downloadFileAsync = async (fileUrl, filePath) => {
  const axios = require('axios');

  return await new Promise((resolve, abort) => {
    const file = fs.createWriteStream(filePath);

    axios
      .get(fileUrl, { responseType: 'stream' })
      .then((response) => {
        response.data.pipe(file);

        file.on('finish', async function () {
          file.close();
          resolve();
        });
      })
      .catch((err) => {
        fs.unlink(filePath, () => {
          console.error(err);
        });

        abort(err);
      });
  });
};

const readCharaAvatar = async (img_url, user_name, public_id_short) => {
  const format = img_url.indexOf('.webp') !== -1 ? 'webp' : 'png';

  const extension = 'webp';
  const destPath = characterPath(user_name);
  const filePath = characterPath(user_name, public_id_short, extension);

  if (!fs.existsSync(filePath)) {
    console.info('---- downloading image', img_url);
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    await downloadFileAsync(img_url, filePath);
  }

  let char_data = null;

  try {
    console.info('---- reading image', filePath);
    switch (format) {
      case 'webp':
        const dataBuffer = fs.readFileSync(filePath);

        const ExifReader = require('exifreader');
        const exif_data = await ExifReader.load(dataBuffer);

        if (exif_data['UserComment']['description']) {
          const description = exif_data['UserComment']['description'];
          try {
            JSON.parse(description);
            char_data = description;
            console.debug(`---- found description: ${char_data?.length}`);
          } catch {
            const byteArr = description.split(',').map(Number);
            const uint8Array = new Uint8Array(byteArr);
            const utf8Decode = new TextDecoder('utf-8', { ignoreBOM: true });
            const char_data_string = utf8Decode.decode(uint8Array);
            char_data = char_data_string;
            console.debug(`---- found encoded string: ${char_data?.length}`);
          }
        } else {
          console.warn('---- no description found in EXIF data.', filePath);
          return false;
        }
        break;

      default:
        throw new Error('Unsupported image format');
    }
  } catch (err) {
    console.error(err);
  }

  if (char_data?.length) {
    // rewrite model
    let data = JSON.parse(char_data);
    data = {
      ...data,
      key: `${user_name}-${public_id_short}`,
      name: data.name,

      dialogues: data.mes_example,
      firstMessage: data.first_mes,

      mes_example: undefined,
      first_mes: undefined,
    };

    char_data = data;

    // write json file
    const charData = JSON.stringify(data);
    const filePath = characterPath(user_name, public_id_short, 'json');
    console.info(`---- writing found data: ${filePath}`);
    fs.writeFileSync(filePath, charData, {
      /* flag: 'a', */
      encoding: 'utf8',
    });
  }

  return char_data;
};

const TavernaiApi = class {
  async status() {
    const response = await useHttp(server).get('/server/status');
    return response.data;
  }

  async board(request) {
    const params = { ...request };
    const response = await useHttp(server).get('/characters/board', { params });
    const data = response.data;
    return data.map((x) => {
      return {
        ...x,
        name: x.name,
        characters: x.characters.map((c) => formatCharacter(c)),
      };
    });
  }

  async listCategories(request) {
    const query = request.search ? encodeURIComponent(search) : null;
    const params = { ...request, search: undefined, q: query };
    const response = await useHttp(server).get('/categories', { params });
    return response.data;
  }
  async listCategoriesCharacters(name, request) {
    const params = { ...request };
    const response = await useHttp(server).get(
      `/categories/${name}/characters`,
      { params }
    );
    const data = response.data;
    return data.map((c) => formatCharacter(c));
  }

  async listCharacters(request) {
    const query = request?.search ? encodeURIComponent(request.search) : null;
    const params = { ...request, q: query, search: undefined };
    const response = await useHttp(server).get('/characters', { params });
    const data = response.data;
    return {
      ...data,
      characters: data.characters.map((c) => formatCharacter(c)),
    };
  }
  async getCharacterDetails(request) {
    const { user_name, public_id_short } = request;
    if (!user_name || !public_id_short) {
      return null;
    }

    let data = null;
    const filePath = characterPath(user_name, public_id_short, 'json');
    if (fs.existsSync(filePath)) {
      console.debug('-- debug: read file: ', filePath);
      data = fs.readFileSync(filePath, {
        encoding: 'utf8',
      });
      data = JSON.parse(data);
    } else {
      const avatarUrl = characterAvatarRoute(user_name, public_id_short);
      console.debug('-- debug: download file: ', avatarUrl);
      data = await readCharaAvatar(avatarUrl, user_name, public_id_short);
    }

    if (!data) {
      return null;
    }

    const details = {
      ...data,
      avatar: characterAvatarRoute(user_name, public_id_short),
    };

    return details;
  }
  async saveCharacterDetails(request, body) {
    const { user_name, public_id_short } = request;
    if (!user_name || !public_id_short) {
      return null;
    }

    const charData = JSON.stringify(body);
    const filePath = characterPath(user_name, public_id_short, 'json');
    fs.writeFileSync(filePath, charData, {
      /* flag: 'a', */ encoding: 'utf8',
    });
  }
  async deleteCharacterDetails(request) {
    const { user_name, public_id_short } = request;
    if (!user_name || !public_id_short) {
      return null;
    }

    const characterFilePath = characterPath(user_name, public_id_short, 'json');
    const avatarFilePath = characterPath(user_name, public_id_short, 'webp');
    const chatFilePath = chatPath(user_name, public_id_short);

    const removeFiles = [characterFilePath, avatarFilePath, chatFilePath];
    for (var index in removeFiles) {
      const filePath = removeFiles[index];
      if (!fs.existsSync(filePath)) {
        continue;
      }

      fs.unlinkSync(filePath);
      console.info('--- removed file ', filePath);
    }
  }

  async listUserCharacters(request) {
    const params = { ...request, name: undefined };
    const response = await useHttp(server).get(
      `/users/${request.name}/characters`,
      { params }
    );
    return response.data;
  }

  async listChats(request) {
    const directory = chatPath();
    if (!fs.existsSync(directory)) {
      return [];
    }

    const chats = [];
    const files = fs.readdirSync(directory);
    console.debug('-- debug: chats files found', files);
    for (const index in files) {
      const file = files[index];
      console.debug('#--- chats - file', file);
      const user_name = file.split('-')[0];
      const public_id_short = file.split('-')[1].split('.')[0];

      const query = { user_name, public_id_short };
      console.info('---- reading chat data ', query);
      const characterData = await this.getCharacterDetails(query);
      const chatData = await this.getChat(query);

      let lastMessage = characterData?.firstMessage;
      if (chatData?.messages?.length) {
        const content = chatData.messages[chatData.messages.length - 1].content;
        if (content) {
          lastMessage = content;
        }
      }

      chats.push({ ...characterData, lastMessage });
    }

    return chats;
  }
  async getChat(request) {
    const { user_name, public_id_short } = request;
    const chatFilePath = chatPath(user_name, public_id_short);
    if (!fs.existsSync(chatFilePath)) {
      return null;
    }

    console.info(`---- reading chat file ${chatFilePath}`);
    let chatData = fs.readFileSync(chatFilePath, {
      encoding: 'utf8',
    });
    chatData = JSON.parse(chatData);
    return chatData;
  }
  async saveChat(request, body) {
    const { user_name, public_id_short } = request;
    if (!user_name || !public_id_short) {
      return null;
    }

    const destPath = chatPath();
    if (!fs.existsSync(destPath)) {
      console.info(`---- creating chat directory ${destPath}`);
      fs.mkdirSync(destPath, { recursive: true });
    }

    const chatFilePath = chatPath(user_name, public_id_short);
    const chatData = JSON.stringify(body);

    console.info(`---- writing chat file ${chatFilePath}`);
    fs.writeFileSync(chatFilePath, chatData, {
      /* flag: 'a', */
      encoding: 'utf8',
    });
  }
};

module.exports = {
  TavernaiApi,
  characterAvatarRoute,
  readCharaAvatar,
  downloadFileAsync,
};
