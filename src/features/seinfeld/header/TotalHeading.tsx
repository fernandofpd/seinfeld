import { useDispatch, useSelector } from 'react-redux';
import { getSortOrder, toggleSort } from '../seinfeldSlice';

export function TotalHeading() {
  const dispatch = useDispatch();
  const sortOrder = useSelector(getSortOrder);

  const sortArrow = sortOrder === 'desc' ? '▼' : '▲';

  return (
    <th className="col-head">
      <div onClick={() => dispatch(toggleSort())}>
        <span>Total</span>
        <div>{sortArrow}</div>
      </div>
    </th>
  );
}
