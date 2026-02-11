import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import vendorService from '../../services/vendorService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const VendorProducts = () => {
    const navigate = useNavigate();
    const { logout, vendorData, user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // First get vendorId from dashboard if vendorData not available
            let vendorId = vendorData?._id;

            if (!vendorId) {
                console.log('VendorData not in context, fetching from API...');
                const dashboardData = await vendorService.getVendorDashboard();
                vendorId = dashboardData.vendor._id;
                console.log('Fetched vendor ID:', vendorId);
            }

            if (vendorId) {
                const data = await productService.getVendorProducts(vendorId);
                console.log('Products fetched:', data);
                setProducts(data.products);
            } else {
                setError('Vendor ID not found');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.response?.data?.message || 'Error loading products');
        } finally {
            setLoading(false);
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
                    <h1>Your Product Catalog</h1>
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <Button variant="secondary" onClick={() => navigate('/vendor/dashboard')}>
                            Home
                        </Button>
                        <Button variant="secondary" onClick={() => logout()}>
                            Log Out
                        </Button>
                    </div>
                </div>

                {loading && (
                    <p style={{ color: 'var(--gray-300)', textAlign: 'center' }}>
                        Loading products...
                    </p>
                )}

                {error && (
                    <p style={{ color: 'var(--error)', textAlign: 'center' }}>
                        {error}
                    </p>
                )}

                {!loading && !error && (
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
                                    fontWeight: 'var(--font-weight-bold)'
                                }}>
                                    ₹{product.price}
                                </p>
                            </Card>
                        ))}

                        {products.length === 0 && (
                            <Card style={{ gridColumn: '1 / -1' }}>
                                <p style={{ color: 'var(--gray-300)', textAlign: 'center', margin: 0 }}>
                                    No products yet. Add products from the "Add New Item" page.
                                </p>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorProducts;
