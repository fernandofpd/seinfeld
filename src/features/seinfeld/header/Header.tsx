import { useSelector } from 'react-redux';
import {
  getSelectedSeason, getSeries, getStatus,
} from '../seinfeldSlice';
import { SeasonHeading } from './SeasonHeading';
import { NameHeading } from './NameHeading';
import { TotalHeading } from './TotalHeading';
import {LOADED} from "../constants";
import {SeasonEpisode} from "./SeasonEpisode";

export function Header() {
  const status = useSelector(getStatus);
  const series = useSelector(getSeries);
  const selectedSeason = useSelector(getSelectedSeason);

  if (status !== LOADED) {
    return <></>;
  }

  const seasonsNumbers = series.seasons.flatMap((season) => {
    const isSelectedSeason = season.season === selectedSeason;

    const seasonEpisodes = season.episodes.map((episode, e) => (
      <SeasonEpisode episode={episode} episodeNumber={e} isSelectedSeason={isSelectedSeason} />
    ));

    return (
      <>
        <SeasonHeading season={season} />
        {seasonEpisodes}
      </>
    );
  });

  return (
    <thead>
      <tr>
        <NameHeading />
        <TotalHeading />
        {seasonsNumbers}
      </tr>
    </thead>
  );
}
