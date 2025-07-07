import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { upload } from "../global_states/importFile";
import { fetchMovies } from "../global_states/moviesSlice";

function Header({addMovie, logout }) { 
    const [file, setFile] = useState();
    const [fileError, setFileError] = useState("");
    const dispatch = useDispatch();
    const token = useSelector(state => state.user.token);

    useEffect(function(){
        async function callback(){
            if(!file){
                return;
            }
            if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
                setFileError("Only .txt files are allowed.");
                return;
            }
            const text = await file.text();
            if (!text.trim()) {
                setFileError("The file is empty.");
                return;
            }
        }
        callback();
    }, [file]);

    async function handleImportFile(){
        if (!file) {
            alert("Please choose a .txt file.");
            return;
        }

        if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
            alert("Only .txt files are allowed.");
            return;
        }

        try {
            const text = await file.text();
            if (!text.trim()) {
                alert("The file is empty. Please choose filled in file");
                return;
            }

            await upload(token, file);
            dispatch(fetchMovies({ token }));
            setFileError(""); // clear error on success
        } catch (error) {
            console.error("Upload failed", error);
            setFileError("Failed to upload file.");
        }
    }

    return (
        <div className=" p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center w-full">
            <h2 className="flex justify-start text-2xl text-blue-600 font-bold ">Movies List</h2>
            <div className="flex items-center justify-end">
                <input
                    type="file" 
                    accept=".txt"
                    className="w-[250px] flex" 
                    onChange={(e) => {
                        const selected = e.target.files[0];
                        setFile(selected);
                        setFileError("");
                    }}
                />
                {fileError && (
                    <p className="text-red-500 text-sm mt-2 w-[130px]">{fileError}</p>
                )}
            </div>
            <div className="w-full sm:col-span-2 lg:col-span-1">
                <div className="flex flex-col sm:flex-row sm:justify-between lg:justify-end gap-4 w-full">
                    <button
                        type="button"
                        onClick={handleImportFile}
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