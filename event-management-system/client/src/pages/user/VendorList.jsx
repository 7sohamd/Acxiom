import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import vendorService from '../../services/vendorService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const VendorList = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [vendors, setVendors] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    const categories = ['all', 'Catering', 'Florist', 'Decoration', 'Lighting'];

    useEffect(() => {
        fetchVendors();
    }, [selectedCategory]);

    const fetchVendors = async () => {
        try {
            let data;
            if (selectedCategory === 'all') {
                data = await vendorService.getAllVendors();
            } else {
                data = await vendorService.getVendorsByCategory(selectedCategory);
            }
            setVendors(data.vendors);
        } catch (error) {
            console.error('Error fetching vendors:', error);
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
                    <h1>Browse Vendors</h1>
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <Button variant="secondary" onClick={() => navigate('/user/dashboard')}>
                            Home
                        </Button>
                        <Button variant="secondary" onClick={() => logout()}>
                            Log Out
                        </Button>
                    </div>
                </div>

                {/* Category Filter */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--space-sm)',
                    marginBottom: 'var(--space-xl)',
                    flexWrap: 'wrap'
                }}>
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category === 'all' ? 'All Categories' : category}
                        </Button>
                    ))}
                </div>

                {/* Vendor Grid */}
                {!loading && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 'var(--space-lg)'
                    }}>
                        {vendors.map((vendor) => (
                            <Card key={vendor._id}>
                                <div style={{ marginBottom: 'var(--space-md)' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: 'var(--space-xs) var(--space-sm)',
                                        background: 'var(--gradient-primary)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: 'var(--font-size-xs)',
                                        marginBottom: 'var(--space-md)'
                                    }}>
                                        {vendor.category}
                                    </span>
                                    <h3 style={{ marginBottom: 'var(--space-sm)' }}>{vendor.name}</h3>
                                    <p style={{ color: 'var(--gray-300)', marginBottom: 'var(--space-xs)' }}>
                                        {vendor.email}
                                    </p>
                                    {vendor.contactDetails && (
                                        <p style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-sm)' }}>
                                            {vendor.contactDetails}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate(`/user/products/${vendor._id}`)}
                                    style={{ width: '100%' }}
                                >
                                    Shop Items
                                </Button>
                            </Card>
                        ))}

                        {vendors.length === 0 && (
                            <p style={{ color: 'var(--gray-300)', gridColumn: '1 / -1', textAlign: 'center' }}>
                                No vendors found in this category.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorList;
