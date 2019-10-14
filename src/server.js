const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 4000;

let q;

// handles post requests
const handlePost = (request, response, parsedUrl) => {
  const body = [];

  request.on('error', () => {
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    switch (parsedUrl.pathname) {
      case '/addUser':
        jsonHandler.addUser(request, response, bodyParams);
        break;
      case '/addDrop':
        jsonHandler.addDrop(request, response, bodyParams);
        break;
      case '/toggleDrop':
        jsonHandler.toggleDrop(request, response, bodyParams);
        break;
      case '/addDate':
        jsonHandler.addDate(request, response, bodyParams);
        break;
      default:
        break;
    }
  });
};

// handles get and head requests
const handleOther = (request, response, parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/':
      q = query.parse(parsedUrl.query);
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getCSS(request, response);
      break;
    case '/getUsers':
      if (request.method === 'GET') jsonHandler.getUsers(request, response);
      else jsonHandler.getUsersMeta(request, response);
      break;
    case '/notReal':
      if (request.method === 'GET') jsonHandler.notFound(request, response);
      else jsonHandler.notFoundMeta(request, response);
      break;
    case '/getUser':
      if (parsedUrl.query) jsonHandler.getUserData(request, response, query.parse(parsedUrl.query));
      else jsonHandler.getUserData(request, response, q);
      break;
    case '/logo':
      htmlHandler.getLogo(request, response);
      break;
    default:
      jsonHandler.notFound(request, response);
      break;
  }
};

// Parses url and directs request to get/post specific functions
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleOther(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
