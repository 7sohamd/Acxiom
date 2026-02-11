import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import vendorService from '../../services/vendorService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const ManageItems = () => {
    const navigate = useNavigate();
    const { logout, vendorData, user } = useAuth();
    const [products, setProducts] = useState([]);
    const [currentVendorId, setCurrentVendorId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchVendorIdAndProducts();
    }, []);

    const fetchVendorIdAndProducts = async () => {
        try {
            let vendorId = vendorData?._id;

            // If vendorData not in context, fetch it from dashboard
            if (!vendorId && user) {
                console.log('Fetching vendor ID from dashboard...');
                const dashboardData = await vendorService.getVendorDashboard();
                vendorId = dashboardData.vendor._id;
                console.log('Vendor ID:', vendorId);
            }

            if (vendorId) {
                setCurrentVendorId(vendorId);
                await fetchProducts(vendorId);
            }
        } catch (error) {
            console.error('Error fetching vendor data:', error);
        }
    };

    const fetchProducts = async (vendorId = currentVendorId) => {
        if (!vendorId) {
            console.error('No vendor ID available');
            return;
        }

        try {
            console.log('Fetching products for vendor:', vendorId);
            const data = await productService.getVendorProducts(vendorId);
            console.log('Products fetched:', data.products);
            setProducts(data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'image') {
            setFormData({
                ...formData,
                image: e.target.files[0]
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('price', formData.price);
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            console.log('Adding product...');
            const result = await productService.addProduct(formDataToSend);
            console.log('Product added:', result);

            setMessage('Product added successfully!');
            setFormData({ name: '', price: '', image: null });

            // Clear file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';

            // Refresh products list
            setTimeout(() => {
                fetchProducts();
            }, 500); // Small delay to ensure backend has saved

        } catch (error) {
            console.error('Error adding product:', error);
            setMessage(error.response?.data?.message || 'Error adding product');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await productService.deleteProduct(productId);
            setMessage('Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error deleting product');
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
                    <h1>Manage Products</h1>
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <Button variant="secondary" onClick={() => navigate('/vendor/dashboard')}>
                            Home
                        </Button>
                        <Button variant="secondary" onClick={() => logout()}>
                            Log Out
                        </Button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2xl)' }}>
                    {/* Add Product Form */}
                    <Card>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Add New Product</h2>

                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Product Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                required
                            />

                            <Input
                                label="Product Price"
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                required
                                step="0.01"
                                min="0"
                            />

                            <Input
                                label="Product Image"
                                type="file"
                                name="image"
                                onChange={handleChange}
                                accept="image/*"
                            />

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
                                type="submit"
                                disabled={loading}
                                style={{ width: '100%' }}
                            >
                                {loading ? 'Adding...' : 'Add The Product'}
                            </Button>
                        </form>
                    </Card>

                    {/* Product List */}
                    <div>
                        <h2 style={{ marginBottom: 'var(--space-lg)', color: 'var(--white)' }}>
                            Your Products ({products.length})
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                            {products.map((product) => (
                                <Card key={product._id} hover={false}>
                                    <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                                        {product.imageUrl && (
                                            <img
                                                src={`http://localhost:5000${product.imageUrl}`}
                                                alt={product.name}
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    objectFit: 'cover',
                                                    borderRadius: 'var(--radius-md)'
                                                }}
                                            />
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-xs)' }}>
                                                {product.name}
                                            </h3>
                                            <p style={{ color: 'var(--gray-300)' }}>
                                                ₹{product.price}
                                            </p>
                                        </div>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card>
                            ))}

                            {products.length === 0 && (
                                <p style={{ color: 'var(--gray-400)', textAlign: 'center' }}>
                                    No products yet. Add your first product!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageItems;
