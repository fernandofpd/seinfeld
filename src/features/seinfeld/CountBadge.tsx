import {Percentage} from "./Percentage";

export function CountBadge(props: { numberOfAppearances: number, numberOfEpisodes: number, isSelectedSeason: boolean }) {
  const { numberOfAppearances, numberOfEpisodes, isSelectedSeason } = props;
  const percentage = Math.floor(numberOfAppearances/numberOfEpisodes*100);
  return (
    <td>
      <div className={`badge-wrapper count  ${isSelectedSeason ? 'selected' : ''}`}>
        <span className="badge-count">{numberOfAppearances}</span>
        <span className="badge-percentage">{percentage}%</span>
      </div>
      <Percentage percentage={percentage} />
    </td>
  );
}
