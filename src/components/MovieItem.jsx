import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import ConfirmationDialog from "./Dialog.jsx";
import { deleteMovie } from "../global_states/moviesSlice.js";

export default function MovieItem({ details, onEdit, onSuccess }) {
    const token = useSelector(state => state.user.token);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false)
    const { error } = useSelector((state) => state.movies);

    const handleCardClick = (e) => { // function to open particular movie details page
        if (e.target.closest(".action-btn")) return;
        navigate(`/movies/${details.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="border rounded-lg p-4 shadow-md cursor-pointer flex flex-row gap-4 relative hover:shadow-lg transition"
        >
        <div className="flex-grow flex flex-col justify-start mb-4 w-[50%]">
            <h2 className="text-lg font-bold mb-1">{details.title}</h2>
            <p className="text-sm ">{details.year}</p>
        </div>

        <div className="flex items-center justify-end gap-4 w-[50%]">
            

            <button
                onClick={(e) => { // here used prevent and stop not to trigger move to movie/:id page
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(details)} // to open movieform with filled in fields
                }
                className="w-10 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items center justify-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z"
                    />
                </svg>
            </button>
            <button
                onClick={(e)=> { // here used prevent and stop not to trigger move to movie/:id page
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(true)}
                }
                className="w-10 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition flex items center justify-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                    />
                </svg>
            </button>
        </div>
        
        {isOpen && <ConfirmationDialog 
                        onConfirm={()=> {
                            dispatch(deleteMovie({ token, id: details.id }))
                            if(!error){
                                onSuccess();
                            }
                        }}
                        onCancel={()=>setIsOpen(false)}/>}
        </div>
    );
}

