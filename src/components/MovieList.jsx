import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Header from "./Header";
import Spinner from "./Spinner";
import Error from "./Error";
import MovieItem from "./MovieItem";
import MovieForm from "./MovieForm";
import { logout } from '../global_states/authSlice';
import { fetchMovies } from "../global_states/moviesSlice.js";
import { useNavigate } from "react-router-dom";
import SuccessDialog from "./SuccessDialog.jsx";

function MovieList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const token = useSelector(state => state.user?.token);
    const { movies, isLoading, error } = useSelector((state) => state.movies);
    
    const [searchItem, setSearchItem] = useState("Title")
    const [searchTerm, setSearchTerm] = useState("")
    const [isFormOpened, setIsFormOpened] = useState(false);
    const [currentMovie, setCurrentMovie] = useState({});
    const [submittedSearchTerm, setSubmittedSearchTerm] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage, setMoviesPerPage] = useState(16);

    useEffect(() => {
        function updateMoviesPerPage() {
            const width = window.innerWidth;
            if (width >= 1024) setMoviesPerPage(16);       // lg
            else if (width >= 768) setMoviesPerPage(12);   // md
            else if (width >= 640) setMoviesPerPage(8);    // sm
            else setMoviesPerPage(4);                      // xs
        }

        updateMoviesPerPage();
        window.addEventListener("resize", updateMoviesPerPage); // this is used in order to change fetched amount of movies per page according to the screen size
        return () => window.removeEventListener("resize", updateMoviesPerPage);
    }, []);

    useEffect(() => {
        // don’t fetch if we still have the form open
        if (isFormOpened) return;

        const offset = (currentPage - 1) * moviesPerPage;

        const query = { // to apply amount of movies fetched according to the screen
            token,
            limit: moviesPerPage.toString(),
            offset: offset.toString(),
        };

        // if there’s a search term, add title/actor
        if (submittedSearchTerm.trim()) {
            if (searchItem === "Title") query.title = submittedSearchTerm;
            else if (searchItem === "Actors") query.actor = submittedSearchTerm;
        }

        dispatch(fetchMovies(query));
    }, [dispatch, token, submittedSearchTerm, searchItem, isFormOpened, currentPage, moviesPerPage]);
    
    function handleSearchSubmit() {
        setSubmittedSearchTerm(searchTerm.trim());
    }

    function handleLogout(){ // this is a function to logout from account
        localStorage.setItem("user", JSON.stringify({}));
        dispatch(logout());
        navigate("/");
    }

    function handleEdit(movie){ // just to open movieForm with filled in all fields
        setCurrentMovie(movie);
        setIsFormOpened(true);
    }

    function success(){ // operation to display the operation was successful (opens dialog)
        setDialogOpen(true);
    }

    const sortedMovies = (movies?.data || []).toSorted(
        (a, b) => a.title.localeCompare(b.title, ['uk', 'en'], {
            sensitivity: 'base',
            ignorePunctuation: true,
        })
    );
    
    return (
        <>
            <Header // component with all the upper buttons and file import
                addMovie={() => {setCurrentMovie(null); setIsFormOpened(true);}}
                logout={handleLogout}
            />
            {isLoading && <Spinner/>}
            {!isLoading && error && <Error error={error}/>}
            {!isLoading && !error &&
                <div className="flex flex-col">
                    <div className="flex gap-4 mb-6 px-6">
                        <div className="flex w-full">  {/* can be separated to detached component (searchFilters) */}
                            <select
                                name="searchItem"
                                value={searchItem}
                                onChange={(e) => setSearchItem(e.target.value)}
                                className="w-30 border rounded-md px-2 py-2 mr-3"
                            >
                                <option value="Title">Title</option>
                                <option value="Actors">Actors</option>
                            </select>
                            <input
                                placeholder={`Search movies by ${searchItem}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSearchSubmit();
                                }}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            />
                            <button
                                onClick={handleSearchSubmit}
                                className="ml-3 px-12 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="grid gap-6
                        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                        auto-rows-fr p-6">                                           {/* this is a list of movies*/}
                        {sortedMovies.length > 0 ? (
                            sortedMovies.map(movie => (
                                <MovieItem key={movie.id} onEdit={handleEdit} onSuccess={success} details={movie} />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500 mt-[100px]">
                                No matching movies found.
                            </div>
                        )}
                    </div>
                    {movies?.meta?.total && (
                        <div className="flex justify-center items-center gap-4 mt-6">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-lg">{currentPage}</span>
                            <button
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={(currentPage * moviesPerPage) >= movies.meta.total}
                                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            }

            {isFormOpened &&  // form to add or edit movie
                <MovieForm 
                    initialItem={currentMovie}
                    onCancel={() => setIsFormOpened(false)}
                    onSuccess={() => {
                        setIsFormOpened(false)
                        if(!error){
                            success();
                        }
                    }}
                />
            }

            {dialogOpen &&  
                <SuccessDialog 
                    onConfirm={() => {
                        setDialogOpen(false);
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
