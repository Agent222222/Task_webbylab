import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { upload } from "../global_states/importFile";
import { fetchMovies } from "../global_states/moviesSlice";

function Header({addMovie, logout }) { 
    const [file, setFile] = useState();
    const dispatch = useDispatch();
    const token = useSelector(state => state.user.token);

    return (
        <div className=" p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center w-full">
            <h2 className="flex justify-start text-2xl text-blue-600 font-bold ">Movies List</h2>
            <input
                type="file" className="w-[180px]" onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="w-full sm:col-span-2 lg:col-span-1">
                <div className="flex flex-col sm:flex-row sm:justify-between lg:justify-end gap-4 w-full">
                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                await upload(token, file);// this is a separate from redux state function to import movies to back from the file
                                dispatch(fetchMovies({ token }));
                            } catch (error) {
                            console.error("Upload failed", error);
                            }
                        }}
                        className="w-full sm:w-[30%] lg:w-auto bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                    >
                        Import movies
                    </button>
                    <button
                        type="button"
                        onClick={addMovie}// addMovie is a function passed as a prop from MovieList to add a film(open the MovieForm)
                        className="w-full sm:w-[30%] lg:w-auto bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Add movie
                    </button>
                    <button
                        type="button"
                        onClick={logout}// function passed from MovieList to logout of account(session)
                        className="w-full sm:w-[30%] lg:w-auto bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>
                </div>
            
        </div>
        
    )
}

export default Header;