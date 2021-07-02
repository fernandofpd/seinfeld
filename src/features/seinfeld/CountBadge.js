import {Percentage} from "./Percentage";

export function CountBadge(props) {
  const { numberOfAppearances, numberOfEpisodes } = props;
  const percentage = Math.floor(numberOfAppearances/numberOfEpisodes*100);
  return (
    <td>
      <div className={`badge-wrapper count  ${props.isSelectedSeason ? 'selected' : ''}`}>
        <span className="badge-count">{numberOfAppearances}</span>
        <span className="badge-percentage">{percentage}%</span>
      </div>
      <Percentage percentage={percentage} />
    </td>
  );
}
