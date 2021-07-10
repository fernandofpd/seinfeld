import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  extractAppearancesBySeason,
  extractEpisodeIdsBySeason,
  extractTotalAppearances, fetchFromAPI,
  sortAndFilterActors,
} from './seinfeldHelpers';
import {LOADED, LOADING, NOT_LOADED, SORT_ASCENDING, SORT_DESCENDING,} from './constants';
import {
  AppearancesBySeasonType,
  CreditsType,
  RootState,
  SeinfeldState,
  SeriesType, SortType,
  StatusType,
  TotalAppearancesType
} from "./seinfeldTypes";

const initialState: SeinfeldState = {
  status: NOT_LOADED,
  credits: [],
  series: {id: '', seasons: []},
  episodeIdsBySeason: [],
  selectedSeason: 2,
  selectedEpisode: undefined,
  totalAppearances: [],
  appearancesBySeason: [],
  sortedActors: [],
  sortOrder: SORT_DESCENDING,
  filter: '',
};

export const fetchData = createAsyncThunk(
  'data/fetch',
  async () => {
    // The value we return becomes the `fulfilled` action payload
    return await fetchFromAPI();
  },
);

export const seinfeldSlice = createSlice({
  name: 'seinfeld',
  initialState,
  reducers: {
    setSelectedSeason: (state, action) => {
      state.selectedSeason = action.payload;
    },
    setSelectedEpisode: (state, action) => {
      state.selectedEpisode = action.payload;
    },
    toggleSort: (state) => {
      const sortOrder = state.sortOrder === SORT_DESCENDING ? SORT_ASCENDING : SORT_DESCENDING;
      state.sortOrder = sortOrder;
      state.sortedActors = sortAndFilterActors(state.filter, state.credits, state.totalAppearances, sortOrder);
    },
    filterActors: (state, action) => {
      const filter = action.payload.trim();
      state.filter = filter;
      state.sortedActors = sortAndFilterActors(filter, state.credits, state.totalAppearances, state.sortOrder);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = LOADING;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        const { series, credits } = action.payload;

        const episodeIdsBySeason = extractEpisodeIdsBySeason(action.payload.series);
        const appearancesBySeason = extractAppearancesBySeason(credits, episodeIdsBySeason);
        const totalAppearances = extractTotalAppearances(appearancesBySeason);
        const sortedActors = sortAndFilterActors(state.filter, state.credits, totalAppearances, state.sortOrder);

        state.status = LOADED;
        state.credits = action.payload.credits;
        state.series = series;
        state.episodeIdsBySeason = episodeIdsBySeason;
        state.appearancesBySeason = appearancesBySeason;
        state.totalAppearances = totalAppearances;
        state.sortedActors = sortedActors;
      })
      .addCase(fetchData.rejected, (state) => {
        state.status = NOT_LOADED;
      });
  },
});

export const { setSelectedSeason, setSelectedEpisode, toggleSort, filterActors } = seinfeldSlice.actions;

export const getStatus = (state: RootState): StatusType => state.seinfeld.status;
export const getCredits = (state: RootState): CreditsType => state.seinfeld.credits;
export const getSeries = (state: RootState): SeriesType => state.seinfeld.series;
export const getEpisodeIds = (state: RootState): string[][] => state.seinfeld.episodeIdsBySeason;
export const getSelectedSeason = (state: RootState): number => state.seinfeld.selectedSeason;
export const getSelectedEpisode = (state: RootState): number | undefined => state.seinfeld.selectedEpisode;
export const getTotalAppearances = (state: RootState): TotalAppearancesType => state.seinfeld.totalAppearances;
export const getAppearancesBySeason = (state: RootState): AppearancesBySeasonType => state.seinfeld.appearancesBySeason;
export const getSortedActors = (state: RootState): string[] => state.seinfeld.sortedActors;
export const getSortOrder = (state: RootState): SortType => state.seinfeld.sortOrder;

export default seinfeldSlice.reducer;
