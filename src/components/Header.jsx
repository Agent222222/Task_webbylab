function Header({addMovie}) {
    return (
        <div className="flex flex-row items-center justify-between p-6">
            <h2 className="flex justify-start text-2xl w-full text-blue-600 font-bold mr-[60%]">Movies List</h2>
            <button
                type="button"
                onClick={addMovie}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
                Add movie
            </button>
        </div>
        
    )
}

export default Header;