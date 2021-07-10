import {LOADED, LOADING, NOT_LOADED, SORT_ASCENDING, SORT_DESCENDING} from "./constants";

export type StatusType = typeof LOADED | typeof LOADING | typeof NOT_LOADED;
export type SortType = typeof SORT_DESCENDING | typeof SORT_ASCENDING;

export type ActorCreditsType = {
  episodeId: string;
  character: string;
}[];

export type ActorType = {
  id: string;
  name: string;
  credits: ActorCreditsType;
};

export type CreditsType = ActorType[];

export type EpisodeType = {
  title: string;
  id: string;
  airDate: string;
};

export type SeasonType = {
  season: number;
  episodes: EpisodeType[];
}

export type SeriesType = {
  id: string;
  seasons: SeasonType[];
}

export type ActorAppearancesBySeasonType = [string, number[]];
export type AppearancesBySeasonType = ActorAppearancesBySeasonType[];
export type ActorTotalAppearancesType = [string, number];
export type TotalAppearancesType = ActorTotalAppearancesType[];

export type SeinfeldState = {
  status: StatusType;
  credits: CreditsType,
  series: SeriesType,
  episodeIdsBySeason: string[][],
  selectedSeason: number,
  selectedEpisode: number | undefined,
  totalAppearances: TotalAppearancesType,
  appearancesBySeason: AppearancesBySeasonType,
  sortedActors: string[],
  sortOrder: SortType,
  filter: string,
};

export type RootState = {
  seinfeld: SeinfeldState;
}


export type SortingFunctionType = (a1: [string, number], a2: [string, number]) => number;
