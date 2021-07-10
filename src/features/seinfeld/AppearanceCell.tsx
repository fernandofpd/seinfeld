import {useDispatch, useSelector} from "react-redux";
import {getSelectedEpisode, setSelectedEpisode} from "./seinfeldSlice";

type AppearanceCellProps = {
  episodeNumber: number,
  numberOfEpisodes: number,
  appearanceByEpisode: boolean[],
  isStarring: boolean,
  isSelectedSeason: boolean
}

export function AppearanceCell(props: AppearanceCellProps) {
  const dispatch = useDispatch();
  const selectedEpisode = useSelector(getSelectedEpisode)

  const { episodeNumber, numberOfEpisodes, isStarring, isSelectedSeason, appearanceByEpisode } = props;
  const isLast = episodeNumber === numberOfEpisodes - 1;

  let classes = 'for-episode';
  if (isLast) classes += ' last';
  if(!isSelectedSeason) classes += ' hidden';
  if(isSelectedSeason && selectedEpisode === episodeNumber) classes += ' here';
  if ((episodeNumber <= numberOfEpisodes && !appearanceByEpisode[episodeNumber + 1]) || isLast) classes += ' end';

  if (isStarring) {
    classes += ' starring';
    if ((episodeNumber > 0 && !appearanceByEpisode[episodeNumber - 1]) || episodeNumber === 0) classes += ' start';

    return (
      <td className={classes} onMouseEnter={() => dispatch(setSelectedEpisode(episodeNumber))} onMouseLeave={() => dispatch(setSelectedEpisode(undefined))}>
        <div className="badge-wrapper">
          <div className="badge" />
        </div>
      </td>
    );
  }

  return (
    <td className={classes} onMouseEnter={() => dispatch(setSelectedEpisode(episodeNumber))} onMouseLeave={() => dispatch(setSelectedEpisode(undefined))}>
      <div className="badge-wrapper" />
    </td>
  );
}
