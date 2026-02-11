import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import cartService from '../../services/cartService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const ProductsPage = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [vendorId]);

    const fetchProducts = async () => {
        try {
            const data = await productService.getVendorProducts(vendorId);
            setProducts(data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            await cartService.addToCart(productId, 1);
            setMessage('Product added to cart!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error adding to cart');
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
                    <h1>Shop Products</h1>
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <Button variant="secondary" onClick={() => navigate('/user/dashboard')}>
                            Home
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/user/cart')}>
                            View Cart
                        </Button>
                        <Button variant="secondary" onClick={() => logout()}>
                            Log Out
                        </Button>
                    </div>
                </div>

                {message && (
                    <div style={{
                        padding: 'var(--space-md)',
                        background: 'var(--success)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--space-lg)',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}

                {!loading && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 'var(--space-lg)'
                    }}>
                        {products.map((product) => (
                            <Card key={product._id}>
                                {product.imageUrl && (
                                    <img
                                        src={`http://localhost:5000${product.imageUrl}`}
                                        alt={product.name}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: 'var(--radius-md)',
                                            marginBottom: 'var(--space-md)'
                                        }}
                                    />
                                )}
                                <h3 style={{ marginBottom: 'var(--space-sm)' }}>{product.name}</h3>
                                <p style={{
                                    color: 'var(--primary-600)',
                                    fontSize: 'var(--font-size-xl)',
                                    fontWeight: 'var(--font-weight-bold)',
                                    marginBottom: 'var(--space-md)'
                                }}>
                                    ₹{product.price}
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={() => handleAddToCart(product._id)}
                                    style={{ width: '100%' }}
                                >
                                    Add to Cart
                                </Button>
                            </Card>
                        ))}

                        {products.length === 0 && (
                            <p style={{ color: 'var(--gray-300)', gridColumn: '1 / -1', textAlign: 'center' }}>
                                No products available from this vendor.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
