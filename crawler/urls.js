const suggestionsURL = (seriesName) => `https://v2.sg.media-imdb.com/suggestion/s/${seriesName}.json`;
const episodesUrl = (id, season = 1) => `https://www.imdb.com/title/${id}/episodes/_ajax?season=${season}`;
const fullCastUrl = (id) => `https://www.imdb.com/title/${id}/fullcredits`;
const personPage = (id) => `https://www.imdb.com/name/${id}`;
const episodeAppearancesUrl = (actorId, seriesId, category) => `https://www.imdb.com/name/${actorId}/episodes/_ajax?title=${seriesId}&category=${category}&ref_marker=nm_flmg_act_6&start_index=0`;

const scriptsURL = 'https://www.seinfeldscripts.com/seinfeld-scripts.html';

module.exports = {
  suggestionsURL,
  episodesUrl,
  fullCastUrl,
  personPage,
  episodeAppearancesUrl,
  scriptsURL
};
