import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    return (
        <div className="page-wrapper">
            <div className="container-sm fade-in">
                <h1 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>
                    WELCOME USER
                </h1>
                <p style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)', color: 'var(--gray-300)' }}>
                    {user?.name}
                </p>

                <Card>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/user/vendors')}
                        >
                            Browse Vendors
                        </Button>

                        <Button
                            variant="primary"
                            onClick={() => navigate('/user/cart')}
                        >
                            Shopping Cart
                        </Button>

                        <Button
                            variant="primary"
                            onClick={() => navigate('/user/order-status')}
                        >
                            Order Status
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={() => logout()}
                        >
                            Log Out
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default UserDashboard;
