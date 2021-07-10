import {useDispatch, useSelector} from 'react-redux';
import {fetchData, getCredits, getSortedActors, getStatus,} from './seinfeldSlice';
import './Seinfeld.css';
import {Header} from './header/Header';
import {ActorRow} from './ActorRow';
import {LOADED, NOT_LOADED} from './constants';

export function Seinfeld() {
  const status = useSelector(getStatus);
  const credits = useSelector(getCredits);
  const sortedActors = useSelector(getSortedActors);

  const dispatch = useDispatch();

  if (status === NOT_LOADED) {
    dispatch(fetchData());
  }

  let mainBody: JSX.Element[] = [];

  if (status === LOADED) {
    mainBody = sortedActors
      .map((actorId) => {
        const actor = credits.find((c) => c.id === actorId)!;
        return <ActorRow actor={actor} />;
      });
  }

  return (
    <div>
      <h1>Seinfeld</h1>
      <h2>Actors appearances in the series</h2>
      <table>
        <Header />
        <tbody>
          {mainBody}
        </tbody>
      </table>
    </div>
  );
}
