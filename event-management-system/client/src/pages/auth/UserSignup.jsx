import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const UserSignup = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'user'
            });
            navigate('/user/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="container-sm fade-in">
                <Card>
                    <h2 className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
                        User Sign Up
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="user@example.com"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password (min 6 characters)"
                            required
                        />

                        {error && (
                            <div style={{
                                color: 'var(--error)',
                                marginBottom: 'var(--space-md)',
                                textAlign: 'center'
                            }}>
                                {error}
                            </div>
                        )}

                        <div className="flex gap-md" style={{ marginTop: 'var(--space-xl)' }}>
                            <Button
                                variant="secondary"
                                onClick={() => navigate('/login-selection')}
                                type="button"
                                style={{ flex: 1 }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                style={{ flex: 1 }}
                            >
                                {loading ? 'Signing up...' : 'Sign Up'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default UserSignup;
