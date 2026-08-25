const https = require('https');
const fs = require('fs');

const url = 'https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp';
const dest = './vendor/json.hpp';

const file = fs.createWriteStream(dest);
https.get(url, function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close();
    console.log('Download completo.');
  });
}).on('error', function(err) {
  fs.unlink(dest);
  console.error('Erro no download:', err.message);
});
