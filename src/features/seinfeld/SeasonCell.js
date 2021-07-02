import { useDispatch } from 'react-redux';
import { setSelectedSeason } from './seinfeldSlice';

export function SeasonCell(props) {
  const dispatch = useDispatch();
  const { season } = props;
  return (
    <th key={season.season} className="slanted season">
      <div onClick={() => dispatch(setSelectedSeason(season.season))}>{`Season ${season.season}`}</div>
    </th>
  );
}
