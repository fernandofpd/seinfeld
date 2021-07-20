const {getTitleId, req, writeFile} = require('./helpers');
const {seriesName} = require('./constants');
const {episodesUrl, suggestionsURL} = require('./urls');
const cheerio = require('cheerio');


const episode2Json = ($el) => {
  const $nameEl = $el.find('[itemprop="name"]');
  return {
    title: $nameEl.text().trim(),
    id: getTitleId($nameEl),
    airDate: $el.find('.airdate').text().trim()
  };
};

const season2Json = (body, season) => {
  const $ = cheerio.load(body);
  return {
    season: season,
    episodes: $('.info')
      .map((_, el) => episode2Json($(el))).get()
  }
}

const getSeries = (filename) => {
  const seasons = [];
  const getSeason = (seriesId, numberOfSeasons, season = 1) => req(episodesUrl(seriesId, season), (response) => {
    seasons.push(season2Json(response.body, season));
    if (season < numberOfSeasons) {
      getSeason(seriesId, numberOfSeasons, season + 1);
    } else {
      const json = {
        id: seriesId,
        seasons: seasons
      }
      writeFile(json, filename);
    }
  })

  req(suggestionsURL(seriesName), (res1) => {
    const seriesId = JSON.parse(res1.body).d[0].id;
    req(episodesUrl(seriesId), (res2) => {
      const $ = cheerio.load(res2.body);
      const numberOfSeasons = parseInt($('#bySeason option').last().val());
      getSeason(seriesId, numberOfSeasons);
    })
  });
};

module.exports = getSeries;
