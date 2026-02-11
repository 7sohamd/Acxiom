import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import '../styles/index.css';

const LoginSelection = () => {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper">
            <div className="container-sm fade-in">
                <Card>
                    <h2 className="text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
                        Select Login Type
                    </h2>

                    <div className="flex flex-col gap-lg">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/login/admin')}
                        >
                            Admin Login
                        </Button>

                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/login/vendor')}
                        >
                            Vendor Login
                        </Button>

                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/login/user')}
                        >
                            User Login
                        </Button>
                    </div>

                    <div className="text-center mt-xl">
                        <p style={{ color: 'var(--gray-300)', marginBottom: 'var(--space-md)' }}>
                            Don't have an account?
                        </p>
                        <div className="flex flex-col gap-md">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => navigate('/signup/admin')}
                            >
                                Admin Signup
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => navigate('/signup/vendor')}
                            >
                                Vendor Signup
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => navigate('/signup/user')}
                            >
                                User Signup
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default LoginSelection;
