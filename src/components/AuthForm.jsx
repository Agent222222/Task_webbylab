import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../global_states/authSlice'; 
import { useNavigate } from 'react-router-dom';

export default function AuthForm() {
    const navigate = useNavigate();
    const { status, isLoading, error } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(function(){
        if(status === 1){
            navigate("/movies");
        }
    }, [status, navigate]);

    function changeAuthType(e){
        e.preventDefault();
        
        if(!isRegister){ // here we have to use !isRegister with "!" as in this function state is still the previous type
            navigate("/register");
        }else{
            navigate("/login");
        }
        setIsRegister(!isRegister);
    }

    function handleChange(e){
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    function handleSubmit(e){
        e.preventDefault();

        const data = isRegister
        ? {
            email: form.email,
            name: form.name,
            password: form.password,
            confirmPassword: form.confirmPassword,
            }
        : {
            email: form.email,
            password: form.password,
            };

        try {
            const action = isRegister ? register(data) : login(data);
            dispatch(action).unwrap();
        } catch (err) {
            console.error('Auth error:', err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center tracking-wider">
            {isRegister ? 'Register' : 'Login'}
            </h2>
            {error && <p className=' text-lg font-bold flex items-center justify-center p-2 mb-3 rounded-md bg-red-200 text-red-500'>{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="w-full px-4 py-2 border rounded"
                />

                {isRegister && (
                    <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className="w-full px-4 py-2 border rounded"
                    />
                )}

                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="w-full px-4 py-2 border rounded"
                />

                {isRegister && (
                    <input
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                    className="w-full px-4 py-2 border rounded"
                    />
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    {isLoading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
                </button>
            </form>

            <p className="text-center mt-4 text-sm">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
                type="button"
                onClick={(e) => changeAuthType(e)}
                className="text-blue-600 hover:underline"
            >
                {isRegister ? 'Login' : 'Register'}
            </button>
            </p>
        </div>
        </div>
    );
}
