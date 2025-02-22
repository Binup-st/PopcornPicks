import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../components/MovieProvider";
import { Button, Card } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function MyWatchlist() {
  const [movieDetails, setMovieDetails] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch Watchlist IDs
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await fetch("/api/movie/getWatchlist", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to retrieve watchlist");
        }

        const data = await res.json();
        const ids = data.watchlist.map((item) => Number(item.movieId));
        setWatchlistIds(ids);
      } catch (err) {
        setError(err.message);
        if (err.status) setUnauthorized(true);
        console.error(err.message);
      }
    };

    fetchWatchlist();
  }, []);

  // Fetch Movie Details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (watchlistIds.length === 0) return;
        setLoading(true);
        const details = await fetchMovieDetails(watchlistIds);
        setMovieDetails(details);
      } catch (err) {
        setError("Failed to fetch movie details");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [watchlistIds]);

  useEffect(() => {}, [watchlistIds]);

  const handleWatchlistClick = async (movieDetail) => {
    const currentId = movieDetail.id;

    try {
      const res = await fetch(`/api/movie/updateWatchlist`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: currentId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to retrieve watchlist");
      }

      const data = await res.json();
      const ids = data.watchlist.map((item) => Number(item.movieId));
      setWatchlistIds(ids);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-[500px]">
        <h1 className="text-3xl font-semibold">Sign In to get Access To My Watchlist</h1>
        <Button
          className="bg-red-500 hover:bg-customRed mt-6"
          onClick={() => navigate("/authpage")}
        >
          Sign In
        </Button>
      </div>
    );

  return (
    <>
      <div>
        <h1>Sign In to get Access to Personal Watchlist Features</h1>
      </div>
      :{" "}
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mt-4">My Watchlist</h1>
        <p className="text-gray-400">Movies you want to watch are here...</p>
        <div className="mt-5 flex flex-wrap justify-center">
          {movieDetails.length > 0 ? (
            movieDetails.map((movieDetail) => (
              <div key={movieDetail.id} className="flex">
                <Card
                  className="w-52 m-2 custom-card cursor-pointer transition-transform duration-300 transform ease-in-out perspective-1000 hover:scale-105 hover:drop-shadow-2xl"
                  imgSrc={`https://image.tmdb.org/t/p/w200${movieDetail.poster_path}`}
                  onClick={() => navigate(`/movie?id=${movieDetail.id}`)}
                >
                  <div className="flex flex-col items-center w-full">
                    <h2 className="text-xl font-semibold tracking-tight leading-5 text-gray-900 dark:text-white text-center mb-2">
                      {movieDetail.title}
                    </h2>
                    <Button
                      onClick={() => handleWatchlistClick(movieDetail)}
                      color={
                        watchlistIds.includes(movieDetail.id)
                          ? "success"
                          : "default"
                      }
                    >
                      {watchlistIds.includes(movieDetail.id)
                        ? "Added to Watchlist"
                        : "+ Watchlist"}
                    </Button>
                  </div>
                </Card>
              </div>
            ))
          ) : (
            <h1>No updates found</h1>
          )}
        </div>
      </div>
    </>
  );
}
