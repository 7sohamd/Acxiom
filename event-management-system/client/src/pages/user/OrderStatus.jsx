import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const OrderStatus = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getUserOrders();
            setOrders(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Received':
                return 'var(--warning)';
            case 'Ready for Shipping':
                return 'var(--accent-600)';
            case 'Out For Delivery':
                return 'var(--success)';
            default:
                return 'var(--gray-400)';
        }
    };

    return (
        <div className="page-wrapper">
            <div className="container fade-in">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-2xl)'
                }}>
                    <h1>Order Status</h1>
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <Button variant="secondary" onClick={() => navigate('/user/dashboard')}>
                            Home
                        </Button>
                        <Button variant="secondary" onClick={() => logout()}>
                            Log Out
                        </Button>
                    </div>
                </div>

                {!loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                        {orders.map((order) => (
                            <Card key={order._id}>
                                <div style={{ marginBottom: 'var(--space-md)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                                        <div>
                                            <h3 style={{ marginBottom: 'var(--space-xs)' }}>
                                                Order #{order._id.slice(-8)}
                                            </h3>
                                            <p style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-sm)' }}>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{
                                                fontSize: 'var(--font-size-xl)',
                                                fontWeight: 'var(--font-weight-bold)',
                                                color: 'var(--white)'
                                            }}>
                                                ₹{order.totalAmount}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{
                                        padding: 'var(--space-md)',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: 'var(--radius-md)',
                                        marginBottom: 'var(--space-md)'
                                    }}>
                                        <p style={{ color: 'var(--gray-300)', marginBottom: 'var(--space-sm)' }}>
                                            Status:
                                        </p>
                                        <p style={{
                                            fontSize: 'var(--font-size-lg)',
                                            fontWeight: 'var(--font-weight-semibold)',
                                            color: getStatusColor(order.status)
                                        }}>
                                            {order.status}
                                        </p>
                                    </div>

                                    <div>
                                        <p style={{ color: 'var(--gray-300)', marginBottom: 'var(--space-sm)' }}>
                                            Items:
                                        </p>
                                        {order.items.map((item, index) => (
                                            <p key={index} style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-sm)' }}>
                                                • {item.name} x{item.quantity} - ₹{item.price * item.quantity}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {orders.length === 0 && (
                            <Card>
                                <p style={{ color: 'var(--gray-300)', textAlign: 'center' }}>
                                    No orders yet. Start shopping!
                                </p>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderStatus;
