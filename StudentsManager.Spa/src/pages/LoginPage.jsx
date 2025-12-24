import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { Login } from '../services/userService';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

    const clearFieldError = (field) => {
        setFieldErrors((prev) => ({ ...prev, [field]: '' }));
        setError('');
    };

    const validateForm = () => {
        const errors = { email: '', password: '' };
        let isValid = true;

        if (!email.trim()) {
            errors.email = 'Email is required.';
            isValid = false;
        }

        if (!password) {
            errors.password = 'Password is required.';
            isValid = false;
        }

        setFieldErrors(errors);
        return isValid;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await Login({ email: email.trim(), password });

            const userId =
                typeof result === 'string' || typeof result === 'number'
                    ? result
                    : result?.userId ?? result?.id;

            if (!userId) {
                setError('Login succeeded, but no user id was returned.');
                return;
            }

            login(String(userId), rememberMe);
            navigate('/');
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                'Login failed.';

            setError(String(message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="login-section" aria-labelledby="login-title">
            <div className="main-inner-content-wrap">
                <div className="login-title-wrap">
                </div>
                <div className="login-grid">
                    <div className="login-grid-wrap" style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="login-content-item">
                            <div className="login-content-item-wrap">
                                <form
                                    className={`login-form ${isSubmitting ? 'loading' : ''}`}
                                    onSubmit={onSubmit}
                                    autoComplete="off"
                                >
                                    <div className={`form-row required ${fieldErrors.email ? 'error-fld' : ''}`}>
                                        <label htmlFor="email" className="label-form-fld">E-mail</label>
                                        <input
                                            type="text"
                                            className="form-fld"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => clearFieldError('email')}
                                            autoComplete="email"
                                        />
                                        <div className="border-bottom"></div>
                                        {fieldErrors.email && (
                                            <div className="tooltip-div">{fieldErrors.email}</div>
                                        )}
                                    </div>

                                    <div className={`form-row required ${fieldErrors.password ? 'error-fld' : ''}`}>
                                        <label htmlFor="password" className="label-form-fld">Password</label>
                                        <input
                                            type="password"
                                            className="form-fld"
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => clearFieldError('password')}
                                            autoComplete="current-password"
                                        />
                                        <div className="border-bottom"></div>
                                        {fieldErrors.password && (
                                            <div className="tooltip-div">{fieldErrors.password}</div>
                                        )}
                                    </div>

                                    <div className="form-row row-checkbox">
                                        <input
                                            type="checkbox"
                                            className="form-fld"
                                            id="data-save"
                                            name="data-save"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <label htmlFor="data-save" className="label-form-fld">Remember me</label>
                                    </div>

                                    {error && (
                                        <div className="form-row">
                                            <p role="alert" className="form-error">{error}</p>
                                        </div>
                                    )}

                                    <div className="form-row btn-row">
                                        <button
                                            className="submit-btn"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Logging in…' : 'LOGIN'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LoginPage;
