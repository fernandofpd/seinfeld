import {useDispatch} from "react-redux";
import {filterActors} from "../seinfeldSlice";
import {debounce} from "../seinfeldHelpers";
import {FormEvent} from "react";

export function NameHeading() {
  const dispatch = useDispatch();

  const handleFilterDebounced = (e: FormEvent<HTMLInputElement>) =>
    debounce((f) => dispatch(filterActors(f)), 200)((e.target as HTMLInputElement).value);

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
