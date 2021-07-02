export const fetchFromAPI = async () => {
  const credits = await fetch('/api/credits.json').then((res) => res.json());
  const series = await fetch('/api/series.json').then((res) => res.json());
  return { credits, series };
};
