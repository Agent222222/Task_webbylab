import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Header from "./Header";
import Spinner from "./Spinner";
import Error from "./Error";
import MovieItem from "./MovieItem";
import MovieForm from "./MovieForm";
import { fetchMovies } from "../global_states/moviesSlice.js";

function MovieList() {
    const dispatch = useDispatch();
    
    const token = useSelector(state => state.user.token);
    const { movies, isLoading, error } = useSelector((state) => state.movies);
    
    const [isFormOpened, setIsFormOpened] = useState(false);
    const [currentMovie, setCurrentMovie] = useState({})
    
    useEffect(() => {
        dispatch(fetchMovies(token));
    }, [dispatch, token]);

    function handleEdit(movie){
        setCurrentMovie(movie);
        setIsFormOpened(true);
    }
    
    return (
        <>
            <Header addMovie={() => {setCurrentMovie(null); setIsFormOpened(true);}}/>
            {isLoading && <Spinner/>}
            {!isLoading && error && <Error/>}
            {!isLoading && !error &&
                <div className="grid gap-6
                    grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                    auto-rows-fr p-6">
                    {movies.data && movies.data.length > 0 ? (
                        movies.data.map(movie => (
                            <MovieItem key={movie.id} onEdit={handleEdit} details={movie} />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 mt-[100px]">
                            Your list is empty, add some movies.
                        </div>
                    )}
                </div>
            }
            {isFormOpened && 
                <MovieForm
                    initialItem={currentMovie}
                    onCancel={() => setIsFormOpened(false)}
                    onSuccess={() => {
                        setIsFormOpened(false)
                    }}
                />
            }
        </>
    )
}

export async function loader(){
    console.log("loaded");
    return {};
}

export default MovieList;
