import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const ProductStatus = () => {
    const navigate = useNavigate();
    const { logout, vendorData } = useAuth();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (vendorData) {
            fetchOrders();
        }
    }, [vendorData]);

    const fetchOrders = async () => {
        try {
            const data = await orderService.getVendorOrders(vendorData._id);
            setOrders(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleUpdateStatus = async () => {
        if (!selectedOrder || !selectedStatus) return;

        try {
            await orderService.updateOrderStatus(selectedOrder, selectedStatus);
            setMessage('Order status updated successfully!');
            fetchOrders();
            setSelectedOrder(null);
            setSelectedStatus('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error updating status');
        }
    };

    const statusOptions = ['Received', 'Ready for Shipping', 'Out For Delivery'];

    return (
        <div className="page-wrapper">
            <div className="container-md fade-in">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-2xl)'
                }}>
                    <h1>Update Order Status</h1>
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <Button variant="secondary" onClick={() => navigate('/vendor/dashboard')}>
                            Home
                        </Button>
                        <Button variant="secondary" onClick={() => logout()}>
                            Log Out
                        </Button>
                    </div>
                </div>

                <Card>
                    {orders.length > 0 ? (
                        <>
                            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Select an Order</h3>

                            <div style={{ marginBottom: 'var(--space-xl)' }}>
                                <select
                                    className="form-select"
                                    value={selectedOrder || ''}
                                    onChange={(e) => setSelectedOrder(e.target.value)}
                                    style={{ marginBottom: 'var(--space-lg)' }}
                                >
                                    <option value="">Select an order...</option>
                                    {orders.map((order) => (
                                        <option key={order._id} value={order._id}>
                                            Order #{order._id.slice(-8)} - {order.customerDetails.name} - Current: {order.status}
                                        </option>
                                    ))}
                                </select>

                                {selectedOrder && (
                                    <>
                                        <h3 style={{ marginBottom: 'var(--space-md)' }}>Update Status</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                            {statusOptions.map((status) => (
                                                <label
                                                    key={status}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 'var(--space-sm)',
                                                        cursor: 'pointer',
                                                        color: 'var(--gray-200)'
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="status"
                                                        value={status}
                                                        checked={selectedStatus === status}
                                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                                    />
                                                    <span>{status}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {message && (
                                <div style={{
                                    color: message.includes('success') ? 'var(--success)' : 'var(--error)',
                                    marginBottom: 'var(--space-md)',
                                    textAlign: 'center'
                                }}>
                                    {message}
                                </div>
                            )}

                            <Button
                                variant="primary"
                                onClick={handleUpdateStatus}
                                disabled={!selectedOrder || !selectedStatus}
                                style={{ width: '100%' }}
                            >
                                Update Status
                            </Button>
                        </>
                    ) : (
                        <p style={{ color: 'var(--gray-300)', textAlign: 'center' }}>
                            No orders yet.
                        </p>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ProductStatus;
