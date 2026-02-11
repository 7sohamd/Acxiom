import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import cartService from '../../services/cartService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const ShoppingCart = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const data = await cartService.getCart();
            setCart(data.cart);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        try {
            await cartService.updateCartItem(productId, quantity);
            fetchCart();
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await cartService.removeFromCart(productId);
            fetchCart();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm('Clear all items from cart?')) return;
        try {
            await cartService.clearCart();
            fetchCart();
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const getTotalPrice = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
    };

    return (
        <div className="page-wrapper">
            <div className="container-md fade-in">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: 'var(--space-2xl)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        width: '100%',
                        marginBottom: 'var(--space-lg)',
                        gap: 'var(--space-md)'
                    }}>
                        <Button variant="secondary" onClick={() => navigate('/user/dashboard')}>
                            Home
                        </Button>
                        <Button variant="secondary" onClick={() => logout()}>
                            Log Out
                        </Button>
                    </div>
                    <h1 style={{ margin: 0 }}>Shopping Cart</h1>
                </div>

                {!loading && cart && cart.items && cart.items.length > 0 ? (
                    <>
                        <div style={{ marginBottom: 'var(--space-xl)' }}>
                            {cart.items.map((item) => (
                                <Card key={item.productId._id} style={{ marginBottom: 'var(--space-md)' }}>
                                    <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                                        {item.productId.imageUrl && (
                                            <img
                                                src={`http://localhost:5000${item.productId.imageUrl}`}
                                                alt={item.productId.name}
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    objectFit: 'cover',
                                                    borderRadius: 'var(--radius-md)'
                                                }}
                                            />
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ marginBottom: 'var(--space-xs)' }}>
                                                {item.productId.name}
                                            </h3>
                                            <p style={{ color: 'var(--gray-300)', marginBottom: 'var(--space-sm)' }}>
                                                ₹{item.price} each
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                                                >
                                                    -
                                                </Button>
                                                <span style={{ padding: '0 var(--space-md)', color: 'var(--white)' }}>
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{
                                                fontSize: 'var(--font-size-xl)',
                                                fontWeight: 'var(--font-weight-semibold)',
                                                marginBottom: 'var(--space-md)',
                                                color: 'var(--white)'
                                            }}>
                                                ₹{item.totalPrice}
                                            </p>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleRemove(item.productId._id)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <Card>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xl)' }}>
                                <h2>Total:</h2>
                                <h2 style={{ color: 'var(--white)' }}>₹{getTotalPrice().toFixed(2)}</h2>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                <Button
                                    variant="danger"
                                    onClick={handleClearCart}
                                    style={{ flex: 1 }}
                                >
                                    Clear Cart
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/user/checkout')}
                                    style={{ flex: 1 }}
                                >
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </Card>
                    </>
                ) : (
                    <Card>
                        <p style={{ color: 'var(--gray-300)', textAlign: 'center' }}>
                            Your cart is empty. Start shopping!
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/user/vendors')}
                            style={{ width: '100%', marginTop: 'var(--space-md)' }}
                        >
                            Browse Vendors
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart;
