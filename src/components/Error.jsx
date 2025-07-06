import { useNavigate } from "react-router-dom";
function Error({error}) {
    const navigate = useNavigate();
    return (
        <div className="flex justify-self-center items-center mt-[100px] text-red-500 flex-col">
            An issue occured: {error || "unknown"}
            <button
                type="button"
                onClick={() => navigate("/")}
                className="text-blue-600 hover:underline p-3"
            >
                Go back
            </button>
        </div>
    )
}

export default Error;
