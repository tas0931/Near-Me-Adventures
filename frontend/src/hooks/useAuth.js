import { useState } from 'react';
import axios from 'axios';

const useAuth = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/api/auth/register', userData);
            setUser(response.data);
        } catch (err) {
            setError(err.response ? err.response.data.message : err.message);
        } finally {
            setLoading(false);
        }
    };

    return { user, error, loading, register };
};

export default useAuth;