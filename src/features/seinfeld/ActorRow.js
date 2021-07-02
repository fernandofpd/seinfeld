import { useSelector } from 'react-redux';
import {
  getAppearancesBySeason,
  getEpisodeIds,
  getSelectedSeason,
  getSeries,
  getTotalAppearances,
} from './seinfeldSlice';
import { CountBadge } from './CountBadge';

export function ActorRow(props) {
  const series = useSelector(getSeries);
  const episodeIdsBySeason = useSelector(getEpisodeIds);
  const selectedSeason = useSelector(getSelectedSeason);
  const { actor } = props;
  const allTotalAppearances = useSelector(getTotalAppearances);
  const allAppearancesBySeason = useSelector(getAppearancesBySeason);
  const actorCredits = actor.credits.map((c) => c.episodeId);

  const appearancesBySeason = allAppearancesBySeason.find((a) => actor.id === a[0])[1];
  const totalAppearances = allTotalAppearances.find((a) => actor.id === a[0])[1];
  const totalEpisodes = episodeIdsBySeason.flatMap((e) => e).length;

  const appearances = series.seasons.flatMap((season, s) => {
    const isSelectedSeason = season.season === selectedSeason;
    const numberOfAppearances = appearancesBySeason[s];

    const appearanceByEpisode = episodeIdsBySeason[s]
      .map((episodeId) => actorCredits.includes(episodeId));
    const numberOfEpisodes = appearanceByEpisode.length;

    const listOfAppearances = appearanceByEpisode.map((isStarring, e) => {
      const isLast = e === numberOfEpisodes - 1;
      let classes = `for-episode ${isLast ? 'last' : ''} ${isSelectedSeason ? '' : 'hidden'}`;
      if ((e <= numberOfEpisodes && !appearanceByEpisode[e + 1]) || isLast) classes += ' end';
      if (isStarring) {
        classes += ' starring';
        if ((e > 0 && !appearanceByEpisode[e - 1]) || e === 0) classes += ' start';

        return (
          <td className={classes}>
            <div className="badge-wrapper">
              <div className="badge" />
            </div>
          </td>
        );
      }

      return (
        <td className={classes}>
          <div className="badge-wrapper" />
        </td>
      );
    });

    return (
      <>
        <CountBadge isSelectedSeason={isSelectedSeason} numberOfAppearances={numberOfAppearances} numberOfEpisodes={numberOfEpisodes}/>
        {listOfAppearances}
      </>
    );
  });
  return (
    <tr>
      <td className="name">{actor.name}</td>
      <CountBadge isSelectedSeason={false} numberOfAppearances={totalAppearances} numberOfEpisodes={totalEpisodes} />
      {appearances}
    </tr>
  );
}
