import {SORT_DESCENDING} from "./constants";

export const extractEpisodeIdsBySeason = (series) => series.seasons
  .map((season) => season.episodes.map((episode) => episode.id));

export const extractAppearancesBySeason = (credits, episodeIdsBySeason) => credits.map((actor) => {
  const actorCredits = actor.credits.map((c) => c.episodeId);
  return [
    actor.id,
    episodeIdsBySeason
      .map((seasonEpisodes) => seasonEpisodes
        .filter((episodeId) => actorCredits.includes(episodeId)).length),
  ];
});

export const extractTotalAppearances = (appearancesBySeason) => appearancesBySeason
  .map((actor) => [actor[0], actor[1].reduce((a, b) => a + b, 0)]);

export const sort = (array, fun) => ([...array]
  .sort(fun)
  .map((a) => a[0])
  .slice(0, 10));

export const decreasingNumber = (a1, a2) => a2[1] - a1[1];
export const increasingNumber = (a1, a2) => -decreasingNumber(a1, a2);

export const sortActors = (totalAppearances, sortOrder) => (
  sort(totalAppearances, sortOrder === SORT_DESCENDING ? decreasingNumber : increasingNumber)
);

export const sortAndFilterActors = (filter, credits, totalAppearances, sortOrder) => {
  let filteredActors = totalAppearances;

  if (filter !== '') {
    filteredActors = credits
      .filter((actor) => actor.name.toLowerCase().trim().includes(filter))
      .map((actor) => {
        const actorId = actor.id;
        const appearances = totalAppearances.find((a) => a[0] === actorId);
        return [actorId, appearances[1]];
      });
  }

  return sortActors(filteredActors, sortOrder);
};

export const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};
