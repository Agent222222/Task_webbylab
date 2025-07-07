import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addMovie, fetchMovieData, fetchMovies, updateMovie } from '../global_states/moviesSlice'

export default function MovieForm({ initialItem = null, onSuccess, onCancel }) { // component to add or edit movies
    const dispatch = useDispatch()
    const token = useSelector(state => state.user.token);
    const { movies } = useSelector(state => state.movies);
    const [form, setForm] = useState({
        title: '',
        year: 2021,
        format: '',
        actors: [''],
    })
    const [formError, setFormError] = useState("");

    useEffect(() => { // thi effect filles all the fields of the form in case movie is passed as a prop initialItem
        if (initialItem?.id && token) {
            dispatch(fetchMovieData({ token, id: initialItem.id }));
        } else if (initialItem) {
            setForm({
                title: initialItem.title ?? '',
                year: initialItem.year ?? new Date().getFullYear(),
                format: initialItem.format ?? '',
                actors: initialItem.actors?.map(a => a.name) ?? [''],
            });
        }
    }, [initialItem, dispatch, token]);

    useEffect(() => { // this effect updates the form fields in case we quickly go to the form one more time
        if (!initialItem?.id || !movies?.data) return;

        const updatedMovie = movies.data.find(m => m.id === initialItem.id);
        if (updatedMovie) {
            setForm({
                title: updatedMovie.title ?? '',
                year: updatedMovie.year ?? new Date().getFullYear(),
                format: updatedMovie.format ?? '',
                actors: updatedMovie.actors?.map(a => a.name) ?? [''],
            });
        }
    }, [movies, initialItem]);

    const handleChange = (e) => { // for the form state elements to be changed 
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: name === 'year' ? Number(value) : value }))
    }

    const handleActorChange = (index, value) => {// for the form actor elements to be changed 
        const updatedActors = [...form.actors]
        updatedActors[index] = value
        setForm(f => ({ ...f, actors: updatedActors }))
    }

    const addActor = () => {
        setForm(f => ({ ...f, actors: [...f.actors, ''] }))
    }

    const removeActor = (index) => {
        setForm(f => ({
            ...f,
            actors: f.actors.filter((_, i) => i !== index)
        }))
    }

    async function handleSubmit(e){ // submitting the form and making a redux function call for the fetch
        e.preventDefault()
        if(!form.title || !form.year || !form.format || !form.actors){
            setFormError("Please fill all the fields")
            return;
        }

        const cleanedForm = { // this is used to remove all clean (empty) fields from the form data and for them not to be sent to back
            ...form,
            actors: form.actors.filter(a => a.trim() !== '')
        };

        try {
            if (initialItem) {
                await dispatch(updateMovie({ token, id: initialItem.id, data: cleanedForm })).unwrap()
            }else{
                await dispatch(addMovie({ token, MovieData: cleanedForm })).unwrap()
            }
            
            dispatch(fetchMovies(token)) 
            onSuccess?.() // in case it is successful operation the callback function will be called from MovieList and form will be closed
        } catch (err) {
            console.error('Failed to save movie:', err)
            setFormError(err);
        }
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={onCancel}
        >
        <div
            className="bg-white rounded-md shadow-lg p-6 max-w-lg w-full"
            onClick={e => e.stopPropagation()}
        >
            <h2 className="text-2xl mb-4">
                {initialItem ? 'Update movie' : 'Add movie'}
            </h2>
            {formError && <p className=' text-lg font-bold flex items-center justify-center p-2 mb-3 rounded-md bg-red-200 text-red-500'>{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block mb-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Year</label>
                    <input
                        type="number"
                        name="year"
                        value={form.year}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        max={2022}
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">Format</label>
                    <select
                        name="format"
                        value={form.format}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">Select Format</option>
                        <option value="VHS">VHS</option>
                        <option value="DVD">DVD</option>
                        <option value="Blu-Ray">Blu-Ray</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1">Actors</label>
                    {form.actors.map((actor, idx) => (
                        <div key={idx} className="flex space-x-2 mb-2">
                            <input
                                type="text"
                                value={actor}
                                onChange={(e) => handleActorChange(idx, e.target.value)}
                                className="w-full border rounded px-3 py-2"
                            />
                            <button
                                type="button"
                                onClick={() => removeActor(idx)}
                                className="text-red-500"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addActor}
                        className="text-sm text-blue-600 hover:underline mt-2"
                    >
                        + Add Actor
                    </button>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-full bg-gray-100 text-blue-700 py-2 rounded hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        {initialItem ? 'Save' : 'Create'}
                    </button>
                </div>
                </form>
        </div>
        </div>
    )
}
