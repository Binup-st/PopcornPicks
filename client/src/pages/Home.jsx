import { useEffect, useState } from "react";
import { fetchMoviesId, fetchMovieDetails } from "../components/MovieProvider";
import { Button, Card } from "flowbite-react";
import { FaStar } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const [movieIds, setMovieIds] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popularMovieId, setPopularMovieId] = useState([]);
  const [popularMovieDetails, setPopularMovieDetails] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [watchlistDetails, setWatchlistDetails] = useState([]);
  const [upcomingMovieId, setUpcomingMovieId] = useState([]);
  const [upcomingMovieDetails, setUpcomingMovieDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
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
    const url = "https://api.themoviedb.org/3/movie/now_playing";

    try {
      setIsLoading(true);
      const fetchMovieId = async () => {
        const movieId = await fetchMoviesId(url);
        setMovieIds(movieId);
      };
      fetchMovieId();
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const arrayMovieId = movieIds.map((movieId) => movieId.id);
        const details = await fetchMovieDetails(arrayMovieId);
        setNowPlaying(details);
      } catch (err) {
        console.log(err.message);
        return null;
      }
    };

    if (popularMovieId.length > 0) {
      loadMovieDetails();
    }
  }, [movieIds]);

  // POPULAR MOVIE
  useEffect(() => {
    const url = "https://api.themoviedb.org/3/movie/popular";

    const fetchMovies = async () => {
      try {
        const latestMovies = await fetchMoviesId(url);
        setPopularMovieId(latestMovies);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const arrayMovieId = popularMovieId.map((movieId) => movieId.id);
        const details = await fetchMovieDetails(arrayMovieId);
        setPopularMovieDetails(details);
      } catch (err) {
        console.log(err.message);
        return null;
      }
    };

    if (popularMovieId.length > 0) {
      loadMovieDetails();
    }
  }, [popularMovieId]);

  // WATCHLIST
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
        console.error("Error fetching watchlist:", err.message);
      }
    };

    fetchWatchlist();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (watchlistIds.length === 0) return;
        setIsLoading(true);
        const details = await fetchMovieDetails(watchlistIds);
        setWatchlistDetails(details);
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [watchlistIds]);

  // UPCOMING
  useEffect(() => {
    const url = "https://api.themoviedb.org/3/movie/upcoming";

    const fetchMovies = async () => {
      try {
        const latestMovies = await fetchMoviesId(url);
        setUpcomingMovieId(latestMovies);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchMovies();
  }, [watchlistIds]);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const arrayMovieId = upcomingMovieId.map((movieId) => movieId.id);
        const details = await fetchMovieDetails(arrayMovieId);
        setUpcomingMovieDetails(details);
      } catch (err) {
        console.log(err.message);
        return null;
      }
    };

    if (upcomingMovieId.length > 0) {
      loadMovieDetails();
    }
  }, [upcomingMovieId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!movieIds) {
    return <div>Error loading movie data</div>;
  }

  const firstMovie = movieIds[0];
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
    <div className="">
      {/* HERO SECTION */}
      {firstMovie && (
        <div className="relative w-screen h-[450px] lg:h-[490px] overflow-hidden">
          <img
            className="w-full h-full object-cover object-top"
            src={`https://image.tmdb.org/t/p/w1280${firstMovie.backdrop_path}`}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-60"></div>

          <div className="absolute inset-0 left-20 top-40">
            <h1 className="sans lg:text-5xl text-4xl text-white">
              {firstMovie.title}
            </h1>
            <div className="flex gap-6 mt-2 mb-3 text-white dark:text-gray-300">
              <p className="flex gap-1">
                <FaStar className="w-5 h-5" color="yellow" />
                {Math.round(firstMovie.vote_average * 10) / 10}/10
              </p>
              <p>{new Date(firstMovie.release_date).getFullYear()}</p>
            </div>
            <button
              className={`${
                watchlistIds.includes(firstMovie.id)
                  ? "bg-green-400 hover:bg-green-700"
                  : "bg-red-500 hover:bg-red-700"
              } px-3 py-2 rounded-md text-white`}
              onClick={() => handleWatchlistClick(firstMovie)}
            >
              {watchlistIds.includes(firstMovie.id)
                ? "Added to Watchlist"
                : "+ Watchlist"}{" "}
            </button>
          </div>
        </div>
      )}

      {/* NOW PLAYING */}
      <div className="px-6 pt-14 mb-7">
        <div className="flex justify-between">
          <h1 className="sans lg:text-3xl text-2xl text-black dark:text-white font-semibold">
            Now Playing
          </h1>
        </div>
        <div className="mx-10 mt-8">
          <Slider {...settings}>
            {nowPlaying && nowPlaying.length > 0 ? (
              nowPlaying.map((movieDetail) => (
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

      {/* Latest HIts */}
      <div className="px-6 py-7 mb-7 bg-gray-200 dark:bg-[rgb(25,35,61)]">
        <div className="flex justify-between">
          <h1 className="sans lg:text-3xl text-2xl text-black dark:text-white font-semibold">
            Explore Latest Hits
          </h1>
          <button
            className="bg-red-500 px-2 py-1 text-sm rounded-md text-white hover:bg-red-700"
            onClick={() => navigate("/popular")}
          >
            View All
          </button>
        </div>
        <div className="mx-10 mt-8">
          <Slider {...settings}>
            {popularMovieDetails && popularMovieDetails.length > 0 ? (
              popularMovieDetails.map((movieDetail) => (
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

      {/* UPCOMING */}
      <div className="px-6 py-7 mb-7">
        <div className="flex justify-between">
          <h1 className="sans lg:text-3xl text-2xl text-black dark:text-white font-semibold">
            Explore Upcoming Movies
          </h1>
          <button
            className="bg-red-500 px-2 py-1 text-sm rounded-md text-white hover:bg-red-700"
            onClick={() => navigate("/upcoming")}
          >
            View All
          </button>
        </div>
        <div className="mx-10 mt-8">
          <Slider {...settings}>
            {upcomingMovieDetails && upcomingMovieDetails.length > 0 ? (
              upcomingMovieDetails.map((movieDetail) => (
                <div key={movieDetail.id} className="flex">
                  <Card
                    className="m-2 w-48 custom-card transition-transform duration-300 transform ease-in-out perspective-1000 hover:scale-105 hover:drop-shadow-2xl"
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

      {/* Watchlist */}
      {currentUser && (
        <div className="px-6 py-7 bg-gray-200 dark:bg-[rgb(25,35,61)]">
          <div className="flex justify-between">
            <h1 className="sans lg:text-3xl text-2xl text-black dark:text-white font-semibold">
              My Watchlist
            </h1>
            <button
              className="bg-red-500 px-2 py-1 text-sm rounded-md text-white hover:bg-red-700"
              onClick={() => navigate("/mywatchlist")}
            >
              View All
            </button>
          </div>
          <div className="mx-10 mt-8">
            <Slider {...settings}>
              {watchlistDetails && watchlistDetails.length > 0 ? (
                watchlistDetails.map((movieDetail) => (
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
      )}

      {/* CTA */}
      {!currentUser && (
        <div className="flex justify-between px-10 lg:px-36 py-20 bg-gray-200 dark:bg-[rgb(25,35,61)]">
          <h1 className="sans w-72 lg:text-4xl text-3xl text-black dark:text-white font-semibold">
            Join Our Movie Community
          </h1>
          <div className="w-2/6 flex flex-col justify-between items-center">
            <p className="text-justify">
              Become part of a vibrant community of film enthusiasts! Create
              your account today and start curating your personalized watchlist
              filled with your favorite movies and shows.
            </p>
            <Button
              className="bg-white hover:bg-customRed mt-6 w-32 h-10"
              outline
              color="light"
              onClick={() => navigate("/authpage")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
