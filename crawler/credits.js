const cheerio = require('cheerio');

const { req, getTitleId, readJsonFile, writeFile } = require('./helpers');
const { personPage, episodeAppearancesUrl } = require('./urls');
const { actorIdsFilename, seriesJsonFilename } = require('./constants');

const getCreditJson = ($el) => {
  const text = $el.text();
  const episodeId = getTitleId($el.find('a'));
  const characters = text.trim().match(/\.\.\. .*/)[0].replace('... ', '').replace(/\(.*\)/,'').trim();
  const voice =  text.includes('voice') ? true : undefined;
  const uncredited = text.includes('uncredited') ? true: undefined;
  return characters.split('/').map(s => s.trim()).map(character => {
    return {
      episodeId,
      character,
      voice,
      uncredited
    }
  })
}

const getCharacters = (seriesJson, actorIds, filename) => {
  const actors = actorIds;
  const credits = [];
  const seriesId = seriesJson.id;

  const getActingCredits = (id) => {
    console.log(`${actors.length} ${id}`);
    req(personPage(id), (res1) => {
      const $1 = cheerio.load(res1.body);
      const category = $1('#name-job-categories').text().toLocaleLowerCase().includes('actor') ? 'actor' : 'actress';
      const actorName = $1('.header .itemprop').text();
      req(episodeAppearancesUrl(id, seriesId, category), (res2) => {
        const $2 = cheerio.load(res2.body);
        const $episodes = $2('.filmo-episodes');
        let actorCredits = [];
        // At least 2 appearances
        if ($episodes.length > 1) {
          $episodes.each((_, el) => {
            getCreditJson($2(el)).forEach(credit =>{
              actorCredits.push(credit);
            });
          });
          const actorJson = {
            id: id,
            name: actorName,
            credits: actorCredits
          };
          credits.push(actorJson);
        }
        if (actors.length > 0) {
          getActingCredits(actors.shift());
        } else {
          writeFile(credits, filename);
        }
      });
    });
  };
  getActingCredits(actors.shift());
  return credits;
};

const getCredits = (filename) => {
  const seriesJson = readJsonFile(seriesJsonFilename);
  const actorIds = readJsonFile(actorIdsFilename);
  getCharacters(seriesJson, actorIds, filename);
}

module.exports = getCredits;
