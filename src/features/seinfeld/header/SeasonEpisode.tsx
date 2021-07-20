import {EpisodeType} from "../seinfeldTypes";
import {useDispatch, useSelector} from "react-redux";
import {getSelectedEpisode, setSelectedEpisode} from "../seinfeldSlice";

type SeasonEpisodeProps = {
  episode: EpisodeType;
  episodeNumber: number,
  isSelectedSeason: boolean;
}

export function SeasonEpisode(props: SeasonEpisodeProps) {
  const dispatch = useDispatch();
  const selectedEpisode = useSelector(getSelectedEpisode);

  const { episode, episodeNumber, isSelectedSeason } = props;

  let classes = 'slanted';
  if(!isSelectedSeason) classes += ' hidden';
  if(isSelectedSeason && selectedEpisode === episodeNumber) classes += ' here';

  return (
    <th key={episode.id} className={classes} onMouseEnter={() => dispatch(setSelectedEpisode(episodeNumber))} onMouseLeave={() => dispatch(setSelectedEpisode(undefined))}>
      <div><span>
        <a href={`https://www.imdb.com/title/${episode.id}`} target="_blank" rel="noreferrer">
          {episode.title}
        </a>
      </span></div>
    </th>
  );
}
