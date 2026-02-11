import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
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
            await login({
                email: formData.email,
                password: formData.password,
                role: 'admin'
            });
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="container-sm fade-in">
                <Card>
                    <h2 className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
                        Admin Login
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="User ID (Email)"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@example.com"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
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
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                style={{ flex: 1 }}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default AdminLogin;
