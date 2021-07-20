import {useSelector} from 'react-redux';
import {
  getAppearancesBySeason,
  getEpisodeIds,
  getSelectedSeason,
  getSeries,
  getTotalAppearances,
} from './seinfeldSlice';
import {CountBadge} from './CountBadge';
import {ActorType} from "./seinfeldTypes";
import {AppearanceCell} from "./AppearanceCell";

export function ActorRow(props: { actor: ActorType }) {
  const series = useSelector(getSeries);
  const episodeIdsBySeason = useSelector(getEpisodeIds);
  const selectedSeason = useSelector(getSelectedSeason);
  const { actor } = props;
  const allTotalAppearances = useSelector(getTotalAppearances);
  const allAppearancesBySeason = useSelector(getAppearancesBySeason);
  const actorCredits = actor.credits.map((c) => c.episodeId);

  const appearancesBySeason = (allAppearancesBySeason.find((a) => actor.id === a[0])!)[1];
  const totalAppearances = (allTotalAppearances.find((a) => actor.id === a[0])!)[1];
  const totalEpisodes = episodeIdsBySeason.flatMap((e) => e).length;

  const appearances = series.seasons.flatMap((season, s) => {
    const isSelectedSeason = season.season === selectedSeason;
    const numberOfAppearances = appearancesBySeason[s];

    const appearanceByEpisode = episodeIdsBySeason[s]
      .map((episodeId) => actorCredits.includes(episodeId));
    const numberOfEpisodes = appearanceByEpisode.length;

    const listOfAppearances = appearanceByEpisode.map((isStarring, e) => (
      <AppearanceCell
        episodeNumber={e}
        numberOfEpisodes={numberOfEpisodes}
        appearanceByEpisode={appearanceByEpisode}
        isStarring={isStarring}
        isSelectedSeason={isSelectedSeason}
      />
    ));
    return (
      <>
        <CountBadge isSelectedSeason={isSelectedSeason} numberOfAppearances={numberOfAppearances} numberOfEpisodes={numberOfEpisodes}/>
        {listOfAppearances}
      </>
    );
  });

  const characters = actor.credits.map((e) => e.character)
    .filter((v, i, a) => a.indexOf(v) === i); // distinct values
  return (
    <tr>
      <td className="name" title={characters.join(', ')}>{actor.name}</td>
      <CountBadge isSelectedSeason={false} numberOfAppearances={totalAppearances} numberOfEpisodes={totalEpisodes} />
      {appearances}
    </tr>
  );
}
