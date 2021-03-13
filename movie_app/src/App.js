import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchBox from './components/SearchBox';
import AddFavourites from './components/AddFavourites';
import RemoveFavourites from './components/RemoveFavourites';

const sort_by = (field, reverse, pr) => {
  const key = pr
    ? function (x) {
      return pr(x[field]);
    }
    : function (x) {
      return x[field];
    };

  reverse = !reverse ? 1 : -1;

  return function (a, b) {
    return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
  };
};

const App = () => {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [view, setView] = useState(false);
  const [order, setOrder] = useState();

  const getMovieRequest = async (searchValue) => {
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=bc64fa40`;
    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.Search) {
      setMovies(responseJson.Search);
    }
  };

  useEffect(() => {
    getMovieRequest(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const movieFavourites = JSON.parse(
      localStorage.getItem('react-movie-app-favourites')
    );
    if (movieFavourites) {
      setFavourites(movieFavourites);
    }
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem('react-movie-app-favourites', JSON.stringify(items))
  };

  const AddFavouriteMovie = (movie) => {
    const newFavouriteList = [...favourites, movie];
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  const RemoveFavouritesMovie = (movie) => {
    const newFavouriteList = favourites.filter(
      (favourite) => favourite.imdbID !== movie.imdbID
    );

    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  const onOrderChangeHandler = (e) => {
    setOrder(e.target.value);
    if (e.target.value === "Year") {
      setMovies((curr) => {
        const newArr = [...curr].sort(sort_by(e.target.value, true, parseInt));
        return newArr;
      });
      return;
    }

    setMovies((curr) => {
      const newFavouriteList = movies.sort(
        sort_by(e.target.value, false, (a) => a.toUpperCase())
      );
      return newFavouriteList;
    });
  };

  return (
    <div className='container-fluid movie-app'>
      <div className='row d-flex align-items-center mt-4 mb-4'>
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="red" class="bi bi-film" viewBox="0 0 16 16">
          <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z" />
        </svg>
        <MovieListHeading heading='Movies' />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      <div className='row'>
        <MovieList
          movies={movies}
          handleFavouritesClick={AddFavouriteMovie}
          favouriteComponent={AddFavourites}
        />
      </div>
      <div className='row d-flex align-items-center mt-4 mb-4'>
        <MovieListHeading heading='Favourites' />
      </div>
      <div className='row'>
        <MovieList
          movies={favourites}
          handleFavouritesClick={RemoveFavouritesMovie}
          favouriteComponent={RemoveFavourites}
        />
      </div>
      <div className='row d-flex align-items-center mt-4 mb-4'>
      </div>
      <div>
        <div className="movies-container">
          <div className="found-container">
            <h3> Sort by: </h3>
            <select
              className="order-style"
              id="order-style"
              value={order}
              onChange={onOrderChangeHandler}
            >
              <option disabled selected value> -- select an option -- </option>
              <option value="Title">Title</option>
              <option value="Year">Year (latest)</option>
            </select>
          </div>

          {movies.map((movie, index) => {
            return (
              <div
                Title={index}
                imdbID={index}
                className={
                  view
                    ? `movie-entity-container movie-entity-1`
                    : `movie-entity-container movie-entity-2`
                }
              >
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default App;
