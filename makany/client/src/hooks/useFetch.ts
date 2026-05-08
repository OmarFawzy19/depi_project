import { useEffect, useState } from "react";

export const useFetch = <T,>(fetcher: () => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetcher()
      .then((result) => mounted && setData(result))
      .catch((err: Error) => mounted && setError(err.message || "Unexpected error"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [fetcher]);

  return { data, loading, error };
};
