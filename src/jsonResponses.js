const user = {
  toDew: [],
  calendar: {},
};

const users = {};

// returns the specified status code and message/id in JSON format
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// Doesn't return content
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const addDate = (request, response, body) => {
  const responseJSON = {
    message: 'Date required',
  };

  if (!body.date) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  const date = `d${body.date}`;

  if (user.calendar[date]) {
    return respondJSONMeta(request, response, 200);
  }
  user.calendar[date] = {};
  user.calendar[date].drops = [];

  responseJSON.message = 'date added successfully';
  return respondJSON(request, response, 201, responseJSON);
};

const addDrop = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  if (!body.list || !body.task) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  const drop = {
    complete: false,
    task: body.task,
    droplets: [],
  };

  if (body.list === 'to-dew') {
    // add to to-dew list's 'drops' array
    user.toDew.push(drop);

    responseJSON.message = 'dew drop added successfully to to-dew list';
    return respondJSON(request, response, 201, responseJSON);
  }

  const date = body.list;
  if (user.calendar[date]) {
    // add to date's 'drops' array
    user.calendar[date].drops.push(drop);

    responseJSON.message = `dew drop added successfully to ${date}`;
    return respondJSON(request, response, 201, responseJSON);
  }

  return respondJSONMeta(request, response, 400);
};

const getUserData = (request, response) => {
  const responseJSON = {
    user,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// Creates a new user in the users object or updates it if it already exists
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

// Returns the users object
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  return respondJSON(request, response, 200, responseJSON);
};

// Returns no content
const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

// Returns the response as JSON
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found!',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

// Returns no content
const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  addUser,
  getUsers,
  getUsersMeta,
  notFound,
  notFoundMeta,
  getUserData,
  addDate,
  addDrop,
};
