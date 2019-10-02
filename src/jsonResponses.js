const users = {};

// returns the specified status code and message/id in JSON format
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

//Doesn't return content
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

//Creates a new user in the users object or updates it if it already exists
const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  let responseCode = 400;

  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, responseCode, responseJSON); // 400
  }

  responseCode = 201;

  if (users[body.name]) {
    // If this user already exists, change the status
    responseCode = 204;
  } else {
    // Otherwise add a new user to the collection
    users[body.name] = {};
    users[body.name].name = body.name;
  }

  // Set the age regardless
  users[body.name].age = body.age;

  // Complete and return the JSON object if it's new
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON); // 201
  }

  // Otherwise return success without content
  return respondJSONMeta(request, response, responseCode); // 204
};

//Returns the users object
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  return respondJSON(request, response, 200, responseJSON);
};

//Returns no content
const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

//Returns the response as JSON
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found!',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

//Returns no content
const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  addUser,
  getUsers,
  getUsersMeta,
  notFound,
  notFoundMeta,
};
