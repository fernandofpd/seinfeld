const fs = require('fs');
const request = require('request');
const $ = require('cheerio');

const seriesName = 'seinfeld';

const episodesJsonFilename = 'episodes.json';
const actorIdsFilename = 'actors.json';
const creditsJsonFilename = 'credits.json';

const suggestionsURL = (name) => `https://v2.sg.media-imdb.com/suggestion/s/${seriesName}.json`;
const episodesUrl = (id, season = 1) => `https://www.imdb.com/title/${id}/episodes/_ajax?season=${season}`;
const fullCastUrl = (id) => `https://www.imdb.com/title/${id}/fullcredits`;
const personPage = (id) => `https://www.imdb.com/name/${id}`;
const episodeAppearancesUrl = (actorId, seriesId, category) => `https://www.imdb.com/name/${actorId}/episodes/_ajax?title=${seriesId}&category=${category}&ref_marker=nm_flmg_act_6&start_index=0`;

const getId = ($el, regex) => $el.attr('href').match(regex)[0];
const getTitleId = ($el) => getId($el, /tt[0-9]+/);
const getNameId = ($el) => getId($el, /nm[0-9]+/);

const req = (url, fun) => request(url, (error, response) => {
  if (error) throw new Error(error);
  fun(response);
});

const writeFile = (json, fileName) => {
  fs.writeFile(fileName, JSON.stringify(json), (error) => {
    if (error) return console.log(error);
    console.log(`${fileName} saved`);
  });
}

const listEpisodeIds = (seriesJson) => {
  const list = [];
  seriesJson.seasons.forEach(season => {
    season.episodes.forEach(episode => {
        list.push(episode.id);
    })
  });
  return list;
};

const listActorIds = (episodeIds) => {
  const list = [];
  const episodes = episodeIds;
  const get = () => {
    req(fullCastUrl(episodes.shift()), (response) => {
      $(response.body)
      .find('.cast_list tr')
      .filter((_, el) => {
        const className = $(el).attr('class');
        return className === 'even' || className === 'odd'
      })
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
        writeFile(list, actorIdsFilename);
      }
    });
  };
  get();
}

const episode2Json = (_, el) => {
  const $el = $(el);
  const $nameEl = $el.find('[itemprop="name"]');
  return {
    title: $nameEl.text().trim(),
    id: getTitleId($nameEl),
    airDate: $el.find('.airdate').text().trim()
  };
};

const season2Json = ($body, season) => {
  return {
    season: season,
    episodes: $body.find('.info').map(episode2Json).get()
  }
}

const getCreditJson = (element) => {
  const $el = $(element);
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

const getCharacters = (seriesJson, actorIds) => {
  const actors = actorIds;
  const credits = [];
  const seriesId = seriesJson.id;

  const getActingCredits = (id) => {
    console.log(`${actors.length} ${id}`);
    req(personPage(id), (res1) => {
      const $body = $(res1.body);
      const category = $body.find('#name-job-categories').text().toLocaleLowerCase().includes('actor') ? 'actor' : 'actress';
      const actorName = $body.find('.header .itemprop').text();
      req(episodeAppearancesUrl(id, seriesId, category), (res2) => {
        $episodes = $(`<div>${res2.body}</div>`).find('.filmo-episodes');
        let actorCredits = [];
        if ($episodes.length > 1) {
          $episodes.each((_, el) => {
            getCreditJson(el).forEach(credit =>{
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
          writeFile(credits, creditsJsonFilename);
        }
      });
    });
  };
  getActingCredits(actors.shift());
};

const getAllEpisodes = () => {
  const seasons = [];
  const getSeason = (seriesId, numberOfSeasons, season = 1) => req(episodesUrl(seriesId, season), (response) => {
    seasons.push(season2Json($(response.body), season));
    if (season < numberOfSeasons) {
      getSeason(seriesId, numberOfSeasons, season + 1);
    } else {
      const json = {
        id: seriesId,
        seasons: seasons
      }
      writeFile(json, episodesJsonFilename);
    }
  })

  req(suggestionsURL(seriesName), (res1) => {
    const seriesId = JSON.parse(res1.body).d[0].id;
    req(episodesUrl(seriesId), (res2) => {
      const numberOfSeasons = parseInt($(res2.body).find('#bySeason option').last().val());
      getSeason(seriesId, numberOfSeasons);
    })
  });
};

try {
  const seriesJson = JSON.parse(fs.readFileSync(episodesJsonFilename, 'utf8'));
  const actorIds = JSON.parse(fs.readFileSync('actorsWith2OrMoreAppearances.json', 'utf-8'));
  getCharacters(seriesJson, actorIds);
  } catch {
    try {
      const seriesJson = JSON.parse(fs.readFileSync(episodesJsonFilename, 'utf8'));
      const episodeIds = listEpisodeIds(seriesJson);
      listActorIds(episodeIds);
    } catch (err) {
      console.error(err);
      getAllEpisodes();
    }
  }
