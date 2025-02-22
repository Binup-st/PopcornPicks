import React, { useEffect, useState } from "react";
import { Button, Card } from "flowbite-react";
import "./styles.css";
import { fetchMovieDetails, fetchMoviesId } from "../components/MovieProvider";
import { useNavigate } from "react-router-dom";

export default function Upcoming() {
  const [moviesId, setMoviesId] = useState([]);
  const [movieDetails, setMovieDetails] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchWatchlist = async () => {
        const resCheck = await fetch("/api/movie/getWatchlist", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!resCheck.ok) {
          const errorData = await resCheck.json();
          console.error(
            "Error fetching watchlist:",
            errorData.message || "Failed to retrieve watchlist"
          );
          return { Success: false, message: errorData.message };
        }

        const dataCheck = await resCheck.json();

        const movieIds = dataCheck.watchlist.map((item) => {
          return Number(item.movieId);
        });

        setWatchlistIds(movieIds);
      };
      fetchWatchlist();
    } catch (err) {
      console.log(err.message);
    }
  }, []);

  useEffect(() => {
    const url = "https://api.themoviedb.org/3/movie/upcoming";

    const fetchMovies = async () => {
      try {
        const latestMovies = await fetchMoviesId(url);
        setMoviesId(latestMovies);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const arrayMovieId = moviesId.map((movieId) => movieId.id);
        const details = await fetchMovieDetails(arrayMovieId);
        setMovieDetails(details);
        console.log(details);
      } catch (err) {
        console.log(err.message);
        return null;
      }
    };

    if (moviesId.length > 0) {
      loadMovieDetails();
    }
  }, [moviesId]);

  const handleWatchlistClick = async (movieDetail) => {
    const movieId = movieDetail.id;
    const movieTitle = movieDetail.title;

    try {
      const res = await fetch(`/api/movie/updateWatchlist`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, movieTitle }),
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

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mt-4">Upcoming Movies</h1>
      <p className="text-gray-400">
        Movies that are releasing soon.
      </p>
      <div className="mt-5 flex flex-wrap justify-center">
        {movieDetails && movieDetails.length > 0 ? (
          movieDetails.map((movieDetail) => (
            <div key={movieDetail.id} className="flex">
              <Card
                className="w-52 m-2 custom-card transition-transform duration-300 ease-in-out transform perspective-1000 hover:scale-105 hover:drop-shadow-2xl"
                imgSrc={`https://image.tmdb.org/t/p/w200${movieDetail.poster_path}`}
                onClick={() => navigate(`/movie?id=${movieDetail.id}`)}
              >
                <div className="flex flex-col items-center w-full">
                  <h2 className="text-xl font-semibold tracking-tight leading-5 text-gray-900 dark:text-white text-center mb-2">
                    {movieDetail.title}
                  </h2>

                  {watchlistIds.includes(movieDetail.id) ? (
                    <Button
                      onClick={() => handleWatchlistClick(movieDetail)}
                      color="success"
                    >
                      Added To Watchlist
                    </Button>
                  ) : (
                    <Button onClick={() => handleWatchlistClick(movieDetail)}>
                      + Watchlist
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          ))
        ) : (
          <h1>No updates found</h1>
        )}
      </div>
    </div>
  );
}
