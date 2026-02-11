import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper">
            <div className="container-sm text-center fade-in">
                <Card>
                    <div style={{ padding: 'var(--space-xl) 0' }}>
                        <div style={{
                            fontSize: '4rem',
                            marginBottom: 'var(--space-lg)',
                            color: 'var(--success)'
                        }}>
                            ✓
                        </div>

                        <h1 style={{ marginBottom: 'var(--space-md)', color: 'var(--success)' }}>
                            Order Placed Successfully!
                        </h1>

                        <p style={{ color: 'var(--gray-300)', marginBottom: 'var(--space-2xl)' }}>
                            Thank you for your order. You will receive a confirmation email shortly.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            <Button
                                variant="primary"
                                onClick={() => navigate('/user/order-status')}
                            >
                                View Order Status
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={() => navigate('/user/dashboard')}
                            >
                                Back to Dashboard
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default OrderSuccess;
