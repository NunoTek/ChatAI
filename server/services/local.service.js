const fs = require('fs');

const settingsPath = () => {
  const path = require('path');

  const fileName = 'settings.json';
  const filePath = path.join('db', fileName);

  return filePath;
};

exports.readSettings = () => {
  const filePath = settingsPath();

  if (!fs.existsSync(filePath)) {
    return {
      name: 'User',
      avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
      secretKey: '',
    };
  }

  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

exports.writeSettings = (settings) => {
  const filePath = settingsPath();

  fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
};
