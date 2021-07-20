const { actorIdsFilename, seriesJsonFilename, creditsJsonFilename } = require('./constants');
const getSeries = require('./series');
const getActorIds = require('./actorIds');
const getCredits = require('./credits');
const { createFile } = require("./helpers");

createFile(seriesJsonFilename, getSeries);
createFile(actorIdsFilename, getActorIds);
createFile(creditsJsonFilename, getCredits);
