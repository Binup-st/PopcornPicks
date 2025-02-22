import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchMovieDetails, fetchMoviesId } from "../components/MovieProvider";
import { Card } from "flowbite-react";

export default function MovieDetail() {
  const location = useLocation();
  const [currentId, setCurrentId] = useState("");
  const [movieDetails, setMovieDetails] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [similarMovieId, setSimilarMovieId] = useState([]);
  const [similarMovieDetails, setSimilarMovieDetails] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState([]);
  const navigate = useNavigate();

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 5,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 5, slidesToScroll: 4 } },
      { breakpoint: 1130, settings: { slidesToShow: 4, slidesToScroll: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 740, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 540, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/movie/${currentId}/similar`;

    const fetchMovies = async () => {
      try {
        const latestMovies = await fetchMoviesId(url);
        setSimilarMovieId(latestMovies);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchMovies();
  }, [currentId]);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const arrayMovieId = similarMovieId.map((movieId) => movieId.id);
        const details = await fetchMovieDetails(arrayMovieId);
        setSimilarMovieDetails(details);
      } catch (err) {
        console.log(err.message);
        return null;
      }
    };

    loadMovieDetails();
  }, [similarMovieId]);

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
    const idParams = new URLSearchParams(location.search);
    const idFromURL = idParams.get("id");
    setCurrentId(idFromURL);
  }, [location.search]);

  useEffect(() => {
    if (!currentId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZWY2NGM0NTdjYmZmMzQ2YTI2NjkyNTJkM2YxODAxMCIsIm5iZiI6MTczMjIwNzEzOS43MTM0MTg3LCJzdWIiOiI2NzIyODI4MTgyNmZlNTc5OWNjNGMxMTMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.TNVk_aLTPw2FtzDOoUui5QYYCWcVXJRohJbRCwMYbg0",
          },
        };

        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${currentId}`,
          options
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        }
        setMovieDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [currentId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!movieDetails) return <div>No movie details found.</div>;

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

  return (
    <div>
      {/* MAIN */}
      <div className="relative w-screen h-[500px] lg:h-[600px] overflow-hidden">
        <img
          className="w-full h-full object-cover object-top"
          src={`https://image.tmdb.org/t/p/w1280${movieDetails.backdrop_path}`}
        />

        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-60"></div>

        <div className="absolute inset-0">
          <div className="flex px-20 py-16">
            <div className="w-52 hidden md:block lg:w-80">
              <img
                src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                alt={movieDetails.title}
              />
            </div>
            <div className="flex flex-col justify-center items-center md:justify-normal md:items-start mt-2 lg:mt-14 w-[500px] md:ml-20 lg:ml-48">
              <h1 className="sans lg:text-5xl text-4xl text-white">
                {movieDetails.title}
              </h1>
              <div className="flex gap-6 mt-2 mb-2 text-white dark:text-gray-300">
                <p className="flex gap-1">
                  <FaStar className="w-5 h-5" color="yellow" />
                  {Math.round(movieDetails.vote_average * 10) / 10}/10
                </p>
                <p>{new Date(movieDetails.release_date).getFullYear()}</p>
              </div>
              <p className="mb-2 text-gray-200">{movieDetails.status}</p>
              <h2 className="text-white text-lg md:text-xl">Overview</h2>
              <p className="text-gray-200 mb-6">{movieDetails.overview}</p>
              <button
                className={`${
                  watchlistIds.includes(movieDetails.id)
                    ? "bg-green-400 hover:bg-green-700"
                    : "bg-red-500 hover:bg-red-700"
                } px-3 py-2 rounded-md text-white`}
                onClick={() => handleWatchlistClick(movieDetails)}
              >
                {watchlistIds.includes(movieDetails.id)
                  ? "Added to Watchlist"
                  : "+ Watchlist"}{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* SIMILAR */}
      <div className="px-6 pt-14 mb-7">
        <div className="flex justify-between">
          <h1 className="sans lg:text-3xl text-2xl text-black dark:text-white font-semibold">
            Similar Movies
          </h1>
        </div>
        <div className="mx-10 mt-8">
          <Slider {...settings}>
            {similarMovieDetails && similarMovieDetails.length > 0 ? (
              similarMovieDetails.map((movieDetail) => (
                <div key={movieDetail.id} className="flex">
                  <Card
                    className="m-2 w-48 custom-card transition-transform duration-300 ease-in-out transform perspective-1000 hover:scale-105 hover:drop-shadow-2xl"
                    imgSrc={`https://image.tmdb.org/t/p/w200${movieDetail.poster_path}`}
                    onClick={() => navigate(`/movie?id=${movieDetail.id}`)}
                  >
                    <div className="flex flex-col items-center w-full">
                      <h2 className="text-lg font-semibold tracking-tight leading-5 text-gray-900 dark:text-white text-center mb-2">
                        {movieDetail.title}
                      </h2>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <h1>No updates found</h1>
            )}
          </Slider>
        </div>
      </div>
    </div>
  );
}
