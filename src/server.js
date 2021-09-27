const http = require('http');
const query = require('querystring');
const apiHandler = require('./apiResponses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedUrl) => {
  const body = [];
  switch (parsedUrl) {
    case '/addUser':

      request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
      });

      request.on('data', (chunk) => {
        body.push(chunk);
      });

      request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const bodyParams = query.parse(bodyString);

        apiHandler.addUser(request, response, bodyParams);
      });
      break;

    default:
      break;
  }
};

const handleGet = (request, response, parsedUrl) => {
  switch (parsedUrl) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getCSS(request, response);
      break;
    case '/getUsers':
      apiHandler.getUsers(request, response);
      break;
    default:
      apiHandler.getNotFound(request, response);
      break;
  }
};

const onRequest = (request, response) => {
  const urlStr = request.url.split('?')[0];

  switch (request.method) {
    case 'POST':
      handlePost(request, response, urlStr);
      break;

    default:
      handleGet(request, response, urlStr);
      break;
  }
};

http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1:${port}`);
