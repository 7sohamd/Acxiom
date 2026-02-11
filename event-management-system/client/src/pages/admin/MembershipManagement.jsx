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
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        vendorId: '',
        duration: '6 months'
    });
    const [formMessage, setFormMessage] = useState('');

    useEffect(() => {
        fetchMemberships();
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const data = await adminService.getAllVendorsAdmin();
            setVendors(data.vendors);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

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

    const handleAddMembership = async (e) => {
        e.preventDefault();
        setFormMessage('');

        if (!formData.vendorId) {
            setFormMessage('Please select a vendor');
            return;
        }

        try {
            await adminService.createMembership(formData);
            setFormMessage('Membership created successfully!');
            setShowAddForm(false);
            setFormData({ vendorId: '', duration: '6 months' });
            fetchMemberships();
            setTimeout(() => setFormMessage(''), 3000);
        } catch (error) {
            setFormMessage('Error creating membership: ' + (error.response?.data?.message || error.message));
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

                {formMessage && (
                    <div style={{
                        color: formMessage.includes('success') ? 'var(--success)' : 'var(--error)',
                        marginBottom: 'var(--space-md)',
                        textAlign: 'center',
                        padding: 'var(--space-md)',
                        background: 'var(--gray-800)',
                        borderRadius: 'var(--radius-md)'
                    }}>
                        {formMessage}
                    </div>
                )}

                <div style={{ marginBottom: 'var(--space-xl)' }}>
                    <Button
                        variant="success"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? 'Cancel' : '+ Add New Membership'}
                    </Button>
                </div>

                {showAddForm && (
                    <Card style={{ marginBottom: 'var(--space-xl)' }}>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Add New Membership</h2>
                        <form onSubmit={handleAddMembership}>
                            <div className="form-group">
                                <label className="form-label">
                                    Vendor <span style={{ color: 'var(--error)' }}>*</span>
                                </label>
                                <select
                                    className="form-select"
                                    value={formData.vendorId}
                                    onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                                    required
                                >
                                    <option value="">Select a vendor...</option>
                                    {vendors.map((vendor) => (
                                        <option key={vendor._id} value={vendor._id}>
                                            {vendor.name} - {vendor.category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Duration <span style={{ color: 'var(--error)' }}>*</span>
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                    {['6 months', '1 year', '2 years'].map((option) => (
                                        <label
                                            key={option}
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
                                                name="duration"
                                                value={option}
                                                checked={formData.duration === option}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Button
                                variant="success"
                                type="submit"
                                style={{ width: '100%', marginTop: 'var(--space-md)' }}
                            >
                                Create Membership
                            </Button>
                        </form>
                    </Card>
                )}

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
                                                    color: 'var(--white)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    fontSize: 'var(--font-size-xs)',
                                                    fontWeight: 'var(--font-weight-semibold)',
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
