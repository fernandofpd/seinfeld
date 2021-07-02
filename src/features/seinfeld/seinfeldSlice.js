import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchFromAPI } from './fetchFromAPI';
import {
  decreasingNumber,
  extractAppearancesBySeason,
  extractEpisodeIdsBySeason,
  extractTotalAppearances, increasingNumber,
  sortActors, sortAndFilterActors,
} from './seinfeldHelpers';
import {
  LOADED, LOADING, NOT_LOADED, SORT_ASCENDING, SORT_DESCENDING,
} from './constants';

const initialState = {
  status: NOT_LOADED,
  credits: [],
  series: {},
  episodeIdsBySeason: [],
  selectedSeason: 2,
  totalAppearances: [],
  appearancesBySeason: [],
  sortedActors: [],
  sortOrder: SORT_DESCENDING,
  filter: '',
};

export const fetchData = createAsyncThunk(
  'data/fetch',
  async () => {
    const response = await fetchFromAPI();
    // The value we return becomes the `fulfilled` action payload
    return response;
  },
);

export const seinfeldSlice = createSlice({
  name: 'seinfeld',
  initialState,
  reducers: {
    setSelectedSeason: (state, action) => {
      state.selectedSeason = action.payload;
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

export const { setSelectedSeason, toggleSort, filterActors } = seinfeldSlice.actions;

export const getStatus = (state) => state.seinfeld.status;
export const getCredits = (state) => state.seinfeld.credits;
export const getSeries = (state) => state.seinfeld.series;
export const getEpisodeIds = (state) => state.seinfeld.episodeIdsBySeason;
export const getSelectedSeason = (state) => state.seinfeld.selectedSeason;
export const getTotalAppearances = (state) => state.seinfeld.totalAppearances;
export const getAppearancesBySeason = (state) => state.seinfeld.appearancesBySeason;
export const getSortedActors = (state) => state.seinfeld.sortedActors;
export const getSortOrder = (state) => state.seinfeld.sortOrder;

export default seinfeldSlice.reducer;
