import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchMovieData } from "../global_states/moviesSlice";
import Spinner from "./Spinner";
import Error from "./Error";

export default function Movie() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector(state => state.user.token);
    const { movies, isLoading, error } = useSelector(state => state.movies);
    const [details, setDetails] = useState(null);

    useEffect(() => {
        if (id && token) {
            dispatch(fetchMovieData({ token, id }));
        }
    }, [dispatch, id, token]);

    useEffect(() => {
        if (movies && id) {
            const movie = movies.data.find( movie => movie.id === Number(id));
            setDetails(movie || null);
        }
    }, [movies, id]);

    function formatDateTime(dateString) {
        if (!dateString) return "N/A";
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        };
        return new Date(dateString).toLocaleString(undefined, options);
    }


    if (isLoading) return <Spinner />;
    if (error) return <Error message={error} />;
    if (!details) return <div>No movie found.</div>;

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-md mt-10">
            <div className="text-4xl font-bold flex items-center justify-between mb-5 text-black p-2 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold mb-5 text-black p-2">
                    {details.title}
                </h1>
                <button
                    className=" bg-red-500 text-white rounded-md pr-1 pl-1 pb-2 h-9 flex items-center justify-center"
                    onClick={() => navigate('/movies')}
                >
                    &times;
                </button>
            </div>

            <div className="text-gray-700 mb-4 space-y-1">
                <p className="text-blue-500 w-full flex items-center justify-between"><strong className="text-gray-700">Year:</strong> {details.year}</p>
                <p className="text-yellow-500 w-full flex items-center justify-between"><strong className="text-gray-700">Format:</strong> {details.format}</p>
                <p className="text-green-500 w-full flex items-center justify-between"><strong className="text-gray-700">Created At:</strong> {formatDateTime(details.createdAt)}</p>
                <p className="text-orange-500 w-full flex items-center justify-between"><strong className="text-gray-700">Last Updated:</strong> {formatDateTime(details.updatedAt)}</p>
            </div>

            <h2 className="text-2xl font-semibold mt-6 mb-3 text-black">Actors</h2>
            <ul className="list-disc list-inside space-y-2">
                {details.actors && details.actors.length > 0 ? (
                    details.actors.map(actor => (
                        <li key={actor.id} className="border p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition list-none">
                            <p className="font-medium text-gray-800">{actor.name}</p>
                            <p className="text-gray-600 text-sm pl-3">
                                Created At: {formatDateTime(actor.createdAt)}
                            </p>
                            <p className="text-gray-600 text-sm pl-3">
                                Last Updated: {formatDateTime(actor.updatedAt)}
                            </p>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-600">No actors found.</p>
                )}
            </ul>
        </div>
    );
}