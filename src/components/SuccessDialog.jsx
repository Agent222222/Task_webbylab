export default function SuccessDialog({ 
    message = "Operation successful", 
    onConfirm
}) {             // this component is used to display successful operations with movies
    return (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={(e) => {
                e.stopPropagation(); 
            }}
        >
            <div 
                className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg"
                onClick={(e) => e.stopPropagation()} 
            >
                <p className="mb-6 text-center text-lg">{message}</p>
                <div className="flex justify-center gap-6">
                    <button
                        onClick={onConfirm}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
}