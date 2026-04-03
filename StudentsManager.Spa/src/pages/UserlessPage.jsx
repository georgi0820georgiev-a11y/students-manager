import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UserlessPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        login('022a6007-f33c-47c3-b811-08de88b121f2');
        navigate('/slido', { replace: true });
    }, []);

    return null;
}

export default UserlessPage;
