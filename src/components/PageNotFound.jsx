import { useNavigate } from 'react-router-dom';

function PageNotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
        </p>
        <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
            Go Home
        </button>
        </div>
    );
}

export default PageNotFound;