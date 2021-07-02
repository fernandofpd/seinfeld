import {useDispatch, useSelector} from "react-redux";
import {filterActors, getSortOrder} from "../seinfeldSlice";
import {debounce} from "../seinfeldHelpers";

export function NameHeading() {
  const dispatch = useDispatch();

  const handleFilterDebounced = (e) => debounce((f) => dispatch(filterActors(f)), 200)(e.target.value);

  return (
    <th className="col-head name">
      <span>Actor</span>
      <div>
        <input
          onInput={handleFilterDebounced}
          type="text"
          placeholder="search"
        />
      </div>
    </th>
  );
}
