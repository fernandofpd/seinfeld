import {SORT_DESCENDING} from "./constants";
import {
  AppearancesBySeasonType,
  CreditsType,
  SeriesType,
  SortingFunctionType,
  SortType,
  TotalAppearancesType
} from "./seinfeldTypes";

export const fetchFromAPI = async () => {
  const credits: CreditsType = await fetch('/api/credits.json').then((res) => res.json());
  const series: SeriesType = await fetch('/api/series.json').then((res) => res.json());
  return { credits, series };
};


export const extractEpisodeIdsBySeason = (series: SeriesType) => series.seasons
  .map((season) => season.episodes.map((episode) => episode.id));

export const extractAppearancesBySeason = (credits: CreditsType, episodeIdsBySeason: string[][]): AppearancesBySeasonType =>
  credits.map((actor) => {
    const actorCredits = actor.credits.map((c) => c.episodeId);
    return [
      actor.id,
      episodeIdsBySeason
        .map((seasonEpisodes) => seasonEpisodes
          .filter((episodeId) => actorCredits.includes(episodeId))
          .length
        ),
    ];
  });

export const extractTotalAppearances = (appearancesBySeason: AppearancesBySeasonType): TotalAppearancesType =>
  appearancesBySeason.map((actor) => [actor[0], actor[1].reduce((a, b) => a + b, 0)]);

export const sort = (array: [string, number][], fun: SortingFunctionType): string[] => ([...array]
  .sort(fun)
  .map((a) => a[0])
  .slice(0, 10));

export const decreasingNumber: SortingFunctionType = (a1, a2) => a2[1] - a1[1];
export const increasingNumber: SortingFunctionType = (a1, a2) => -decreasingNumber(a1, a2);

export const sortActors = (totalAppearances: TotalAppearancesType, sortOrder: SortType) => (
  sort(totalAppearances, sortOrder === SORT_DESCENDING ? decreasingNumber : increasingNumber)
);

export const sortAndFilterActors = (filter: string, credits: CreditsType, totalAppearances: TotalAppearancesType, sortOrder: SortType) => {
  let filteredActors = totalAppearances;

  if (filter !== '') {
    filteredActors = credits
      .filter((actor) => actor.name.toLowerCase().trim().includes(filter))
      .map((actor) => {
        const actorId = actor.id;
        const appearances = totalAppearances.find((a) => a[0] === actorId)!;
        return [actorId, appearances[1]];
      });
  }

  return sortActors(filteredActors, sortOrder);
};

export const debounce = (callback: (a: string) => void, wait: number) => {
  let timeoutId: number | undefined = undefined;
  return (...args: [a: string]) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      // eslint-disable-next-line prefer-spread
      callback.apply(null, args);
    }, wait);
  };
};
