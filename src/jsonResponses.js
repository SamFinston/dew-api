const user = {
  toDew: [],
  calendar: {},
  showComplete: false,
};

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

// Adds date to user's calendar array
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

// Adds task to to-dew list or specified date
const addDrop = (request, response, body) => {
  const responseJSON = {
    message: 'List and task are both required.',
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

  if (body.list === 'to-dew' || body.list === 'to-dew-list') {
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

// Finds the index of a task in a given list
const findDropIndex = (arr, prop, value) => {
  for (let j = 0; j < arr.length; j++) {
    if ((arr[j])[prop] === value) return j;
  }

  return -1;
};

// Finds the given task and toggles its "complete" boolean
const toggleDrop = (request, response, body) => {
  const responseJSON = {
    message: 'List and task are both required.',
  };

  if (!body.list || !body.task) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  if (body.list === 'to-dew' || body.list === 'to-dew-list') {
    const index = findDropIndex(user.toDew, 'task', body.task);
    if (index >= 0) {
      user.toDew[index].complete = !user.toDew[index].complete;
      responseJSON.message = 'dew drop successfully toggled';
      return respondJSON(request, response, 201, responseJSON);
    }
  }

  const date = body.list;
  if (user.calendar[date]) {
    const index = findDropIndex(user.calendar[date].drops, 'task', body.task);
    if (index >= 0) {
      user.calendar[date].drops[index].complete = !user.calendar[date].drops[index].complete;
      responseJSON.message = 'dew drop successfully toggled';
      return respondJSON(request, response, 201, responseJSON);
    }
  }

  return respondJSONMeta(request, response, 400);
};

// Returns the entire user object
// takes query parameter to check if the user asked for complete tasks
const getUserData = (request, response, params) => {
  if (params.filter && params.filter === 'complete') {
    user.showComplete = true;
  } else {
    user.showComplete = false;
  }

  const responseJSON = {
    user,
  };

  return respondJSON(request, response, 200, responseJSON);
};

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
  notFound,
  notFoundMeta,
  getUserData,
  addDate,
  addDrop,
  toggleDrop,
};
