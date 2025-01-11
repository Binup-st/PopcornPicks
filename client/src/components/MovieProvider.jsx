export const fetchMoviesId = async (url) => {

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZWY2NGM0NTdjYmZmMzQ2YTI2NjkyNTJkM2YxODAxMCIsIm5iZiI6MTczMjIwNzEzOS43MTM0MTg3LCJzdWIiOiI2NzIyODI4MTgyNmZlNTc5OWNjNGMxMTMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.TNVk_aLTPw2FtzDOoUui5QYYCWcVXJRohJbRCwMYbg0",
      },
    };

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      }
      return data.results;
    } catch (err) {
      console.log(err.message);
    }
  };

  export const fetchMovieDetails = async (moviesId) => {
    const movieDetailsPromises = moviesId.map(async (movieId) => {
      const url = `https://api.themoviedb.org/3/movie/${movieId}`;

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZWY2NGM0NTdjYmZmMzQ2YTI2NjkyNTJkM2YxODAxMCIsIm5iZiI6MTczMjIwNzEzOS43MTM0MTg3LCJzdWIiOiI2NzIyODI4MTgyNmZlNTc5OWNjNGMxMTMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.TNVk_aLTPw2FtzDOoUui5QYYCWcVXJRohJbRCwMYbg0",
        },
      };

      try {
        const res = await fetch(url, options);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        }
        return data;
      } catch (err) {
        console.log(err.message);
        return null;
      }
    });
    const details = await Promise.all(movieDetailsPromises);
    return (details.filter((movie) => movie !== null));
  };
