import { useSelector } from 'react-redux';
import {
  getSelectedSeason, getSeries, getStatus,
} from '../seinfeldSlice';
import { SeasonCell } from '../SeasonCell';
import { NameHeading } from './NameHeading';
import { TotalHeading } from './TotalHeading';
import {LOADED} from "../constants";

export function Header() {
  const status = useSelector(getStatus);
  const series = useSelector(getSeries);
  const selectedSeason = useSelector(getSelectedSeason);

  if (status !== LOADED) {
    return <></>;
  }

  const seasonsNumbers = series.seasons.flatMap((season) => {
    const isSelectedSeason = season.season === selectedSeason;

    const seasonEpisodes = season.episodes.map((episode) => (
      <th key={episode.id} className={`slanted ${isSelectedSeason ? '' : 'hidden'}`}>
        <div><span>{episode.title}</span></div>
      </th>
    ));

    return (
      <>
        <SeasonCell season={season} />
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
