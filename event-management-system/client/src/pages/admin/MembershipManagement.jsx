import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const MembershipManagement = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMemberships();
    }, []);

    const fetchMemberships = async () => {
        try {
            const data = await adminService.getAllMemberships();
            setMemberships(data.memberships);
        } catch (error) {
            console.error('Error fetching memberships:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExtend = async (vendorId) => {
        try {
            await adminService.extendMembership(vendorId, 6); // Extend by 6 months
            alert('Membership extended by 6 months!');
            fetchMemberships();
        } catch (error) {
            alert('Error extending membership: ' + error.response?.data?.message);
        }
    };

    const handleCancel = async (vendorId) => {
        if (!window.confirm('Are you sure you want to cancel this membership?')) return;

        try {
            await adminService.cancelMembership(vendorId);
            fetchMemberships();
        } catch (error) {
            alert('Error cancelling membership: ' + error.response?.data?.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'var(--success)';
            case 'expired': return 'var(--error)';
            case 'cancelled': return 'var(--gray-400)';
            default: return 'var(--gray-400)';
        }
    };

    const getDaysRemaining = (endDate) => {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
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
                    <h1>Membership Management</h1>
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <Button variant="secondary" onClick={() => navigate('/admin/dashboard')}>
                            Back to Dashboard
                        </Button>
                        <Button variant="secondary" onClick={() => logout()}>
                            Log Out
                        </Button>
                    </div>
                </div>

                {loading && <p style={{ color: 'var(--gray-300)' }}>Loading memberships...</p>}

                {!loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        {memberships.map((membership) => {
                            const daysLeft = getDaysRemaining(membership.endDate);

                            return (
                                <Card key={membership._id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                                                <h3 style={{ margin: 0 }}>
                                                    {membership.vendorId?.name || 'Unknown Vendor'}
                                                </h3>
                                                <span style={{
                                                    padding: 'var(--space-xs) var(--space-sm)',
                                                    background: getStatusColor(membership.status),
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: 'var(--font-size-xs)',
                                                    fontWeight: 'var(--font-weight-bold)',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {membership.status}
                                                </span>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
                                                <div>
                                                    <p style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-xs)' }}>
                                                        Duration
                                                    </p>
                                                    <p style={{ color: 'var(--white)', fontWeight: 'var(--font-weight-semibold)' }}>
                                                        {membership.duration}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-xs)' }}>
                                                        Days Remaining
                                                    </p>
                                                    <p style={{
                                                        color: daysLeft < 30 ? 'var(--warning)' : 'var(--success)',
                                                        fontWeight: 'var(--font-weight-semibold)'
                                                    }}>
                                                        {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-xs)' }}>
                                                        Start Date
                                                    </p>
                                                    <p style={{ color: 'var(--white)' }}>
                                                        {new Date(membership.startDate).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-xs)' }}>
                                                        End Date
                                                    </p>
                                                    <p style={{ color: 'var(--white)' }}>
                                                        {new Date(membership.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginLeft: 'var(--space-lg)' }}>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleExtend(membership.vendorId._id)}
                                                disabled={membership.status === 'cancelled'}
                                            >
                                                Extend (+6mo)
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleCancel(membership.vendorId._id)}
                                                disabled={membership.status === 'cancelled'}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}

                        {memberships.length === 0 && (
                            <Card>
                                <p style={{ color: 'var(--gray-300)', textAlign: 'center', margin: 0 }}>
                                    No memberships found.
                                </p>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MembershipManagement;
