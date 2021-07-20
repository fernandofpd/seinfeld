const cheerio = require('cheerio');

const { getNameId, req, writeFile, readJsonFile } = require('./helpers');
const { seriesJsonFilename } = require('./constants');
const { fullCastUrl } = require('./urls');

const listEpisodeIds = (seriesJson) => {
  const list = [];
  seriesJson.seasons.forEach(season => {
    season.episodes.forEach(episode => {
      list.push(episode.id);
    })
  });
  return list;
};

const listActorIds = (episodeIds, filename) => {
  const list = [];
  const episodes = episodeIds;
  const get = () => {
    req(fullCastUrl(episodes.shift()), (response) => {
      const $ = cheerio.load(response.body);
      $('.cast_list tr.even, .cast_list tr.odd')
        .each((_, el) => {
          const actorId = getNameId($(el).find('td').eq(1).find('a'));

          if (!list.includes(actorId)) {
            list.push(actorId);
            console.log(actorId);
          }
        });

      if (episodes.length > 0) {
        get();
      } else {
        writeFile(list, filename);
      }
    });
  };
  get();
}

const getActorIds = (filename) => {
  const seriesJson = readJsonFile(seriesJsonFilename);
  const episodeIds = listEpisodeIds(seriesJson);
  listActorIds(episodeIds, filename);
}

module.exports = getActorIds;
