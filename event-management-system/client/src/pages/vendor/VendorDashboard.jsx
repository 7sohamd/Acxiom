import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import vendorService from '../../services/vendorService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const VendorDashboard = () => {
    const navigate = useNavigate();
    const { logout, user, vendorData } = useAuth();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const data = await vendorService.getVendorDashboard();
            setDashboard(data);
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="page-wrapper">
            <div className="container fade-in">
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                    <h1 style={{ marginBottom: 'var(--space-sm)' }}>
                        Welcome Vendor
                    </h1>
                    <p style={{ color: 'var(--gray-300)' }}>
                        {vendorData?.name || user?.name} - {vendorData?.category}
                    </p>
                </div>

                {!loading && dashboard && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 'var(--space-lg)',
                        marginBottom: 'var(--space-2xl)'
                    }}>
                        <Card>
                            <h3 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-sm)' }}>
                                {dashboard.stats.totalProducts}
                            </h3>
                            <p style={{ color: 'var(--gray-300)' }}>Total Products</p>
                        </Card>
                        <Card>
                            <h3 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-sm)' }}>
                                {dashboard.stats.totalOrders}
                            </h3>
                            <p style={{ color: 'var(--gray-300)' }}>Total Orders</p>
                        </Card>
                        <Card>
                            <h3 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-sm)' }}>
                                {dashboard.stats.pendingOrders}
                            </h3>
                            <p style={{ color: 'var(--gray-300)' }}>Pending Orders</p>
                        </Card>
                        <Card>
                            <h3 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-sm)' }}>
                                ₹{dashboard.stats.totalRevenue.toFixed(2)}
                            </h3>
                            <p style={{ color: 'var(--gray-300)' }}>Total Revenue</p>
                        </Card>
                    </div>
                )}

                <Card>
                    <h2 style={{ marginBottom: 'var(--space-xl)' }}>Quick Actions</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/vendor/products')}
                        >
                            Your Items
                        </Button>

                        <Button
                            variant="primary"
                            onClick={() => navigate('/vendor/manage-items')}
                        >
                            Add New Item
                        </Button>

                        <Button
                            variant="primary"
                            onClick={() => navigate('/vendor/product-status')}
                        >
                            Update Order Status
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={handleLogout}
                        >
                            Log Out
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default VendorDashboard;
