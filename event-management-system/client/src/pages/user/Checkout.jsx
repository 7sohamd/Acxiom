import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import cartService from '../../services/cartService';
import orderService from '../../services/orderService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
        contactNumber: '',
        paymentMethod: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await cartService.getCart();
            setCart(data.cart);
            if (!data.cart || !data.cart.items || data.cart.items.length === 0) {
                navigate('/user/cart');
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const getTotalPrice = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const orderData = {
                customerDetails: {
                    name: formData.name,
                    email: formData.email,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pinCode: formData.pinCode,
                    contactNumber: formData.contactNumber
                },
                paymentMethod: formData.paymentMethod
            };

            await orderService.createOrder(orderData);
            navigate('/user/order-success');
        } catch (err) {
            console.error('Order error:', err);
            setError(err.response?.data?.message || 'Error placing order');
        } finally {
            setLoading(false);
        }
    };

    const paymentMethods = [
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'debit_card', label: 'Debit Card' },
        { value: 'upi', label: 'UPI' },
        { value: 'cash_on_delivery', label: 'Cash on Delivery' }
    ];

    return (
        <div className="page-wrapper">
            <div className="container-md fade-in">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-2xl)'
                }}>
                    <h1>Checkout</h1>
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <Button variant="secondary" onClick={() => navigate('/user/cart')}>
                            Back to Cart
                        </Button>
                        <Button variant="secondary" onClick={() => logout()}>
                            Log Out
                        </Button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
                    {/* Order Form */}
                    <Card>
                        <h2 style={{ marginBottom: 'var(--space-xl)' }}>Customer Details</h2>

                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Full Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />

                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                required
                            />

                            <Input
                                label="Contact Number"
                                type="tel"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="Phone number"
                                required
                            />

                            <Input
                                label="Address"
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Street address"
                                required
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                                <Input
                                    label="City"
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    required
                                />

                                <Input
                                    label="State"
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    required
                                />
                            </div>

                            <Input
                                label="Pin Code"
                                type="text"
                                name="pinCode"
                                value={formData.pinCode}
                                onChange={handleChange}
                                placeholder="Pin code"
                                required
                            />

                            <Select
                                label="Payment Method"
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                options={paymentMethods}
                                placeholder="Select payment method"
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

                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                style={{ width: '100%', marginTop: 'var(--space-md)' }}
                            >
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </Button>
                        </form>
                    </Card>

                    {/* Order Summary */}
                    <div>
                        <Card>
                            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Order Summary</h2>

                            {cart && cart.items && (
                                <>
                                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                                        {cart.items.map((item) => (
                                            <div
                                                key={item.productId._id}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 'var(--space-sm)',
                                                    paddingBottom: 'var(--space-sm)',
                                                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                                                }}
                                            >
                                                <span style={{ color: 'var(--gray-300)' }}>
                                                    {item.productId.name} x{item.quantity}
                                                </span>
                                                <span style={{ color: 'var(--white)' }}>
                                                    ₹{item.totalPrice}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: 'var(--font-size-xl)',
                                        fontWeight: 'var(--font-weight-bold)',
                                        color: 'var(--primary-500)'
                                    }}>
                                        <span>Total:</span>
                                        <span>₹{getTotalPrice().toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
