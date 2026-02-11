import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const VendorManagement = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'Catering',
        contactDetails: ''
    });

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const data = await adminService.getAllVendorsAdmin();
            setVendors(data.vendors);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVendor) {
                // Update existing vendor
                await adminService.updateVendor(editingVendor._id, formData);
                alert('Vendor updated successfully!');
            } else {
                // Create new vendor
                await adminService.createVendor(formData);
                alert('Vendor created successfully!');
            }
            setShowForm(false);
            setEditingVendor(null);
            setFormData({ name: '', email: '', category: 'Catering', contactDetails: '' });
            fetchVendors();
        } catch (error) {
            alert('Error: ' + error.response?.data?.message);
        }
    };

    const handleEdit = (vendor) => {
        setEditingVendor(vendor);
        setFormData({
            name: vendor.name,
            email: vendor.email,
            category: vendor.category,
            contactDetails: vendor.contactDetails || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (vendorId) => {
        if (!window.confirm('Are you sure you want to delete this vendor?')) return;

        try {
            await adminService.deleteVendor(vendorId);
            fetchVendors();
        } catch (error) {
            alert('Error deleting vendor: ' + error.response?.data?.message);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingVendor(null);
        setFormData({ name: '', email: '', category: 'Catering', contactDetails: '' });
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Catering': 'var(--primary-600)',
            'Florist': 'var(--success)',
            'Decoration': 'var(--secondary-600)',
            'Lighting': 'var(--accent-600)'
        };
        return colors[category] || 'var(--gray-400)';
    };

    const categoryOptions = [
        { value: 'Catering', label: 'Catering' },
        { value: 'Florist', label: 'Florist' },
        { value: 'Decoration', label: 'Decoration' },
        { value: 'Lighting', label: 'Lighting' }
    ];

    return (
        <div className="page-wrapper">
            <div className="container fade-in">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-2xl)'
                }}>
                    <h1>Vendor Management</h1>
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        {!showForm && (
                            <Button variant="success" onClick={() => setShowForm(true)}>
                                + Add New Vendor
                            </Button>
                        )}
                        <Button variant="secondary" onClick={() => navigate('/admin/dashboard')}>
                            Home
                        </Button>
                        <Button variant="secondary" onClick={() => logout()}>
                            Log Out
                        </Button>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <Card style={{ marginBottom: 'var(--space-xl)' }}>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>
                            {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Vendor Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter vendor name"
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="vendor@example.com"
                                required
                            />
                            <Select
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                options={categoryOptions}
                                required
                            />
                            <Input
                                label="Contact Details"
                                type="text"
                                name="contactDetails"
                                value={formData.contactDetails}
                                onChange={handleChange}
                                placeholder="Phone number or additional contact info"
                            />
                            <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
                                <Button variant="secondary" onClick={handleCancel} type="button" style={{ flex: 1 }}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit" style={{ flex: 1 }}>
                                    {editingVendor ? 'Update Vendor' : 'Create Vendor'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* Vendor List */}
                {loading && <p style={{ color: 'var(--gray-300)' }}>Loading vendors...</p>}

                {!loading && !showForm && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: 'var(--space-lg)'
                    }}>
                        {vendors.map((vendor) => (
                            <Card key={vendor._id}>
                                <div style={{ marginBottom: 'var(--space-md)' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: 'var(--space-xs) var(--space-sm)',
                                        background: getCategoryColor(vendor.category),
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: 'var(--font-size-xs)',
                                        fontWeight: 'var(--font-weight-bold)',
                                        marginBottom: 'var(--space-md)'
                                    }}>
                                        {vendor.category}
                                    </span>
                                    <h3 style={{ marginBottom: 'var(--space-sm)' }}>{vendor.name}</h3>
                                    <p style={{ color: 'var(--gray-300)', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-sm)' }}>
                                        📧 {vendor.email}
                                    </p>
                                    {vendor.contactDetails && (
                                        <p style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-sm)' }}>
                                            📱 {vendor.contactDetails}
                                        </p>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleEdit(vendor)}
                                        style={{ flex: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(vendor._id)}
                                        style={{ flex: 1 }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card>
                        ))}

                        {vendors.length === 0 && (
                            <Card style={{ gridColumn: '1 / -1' }}>
                                <p style={{ color: 'var(--gray-300)', textAlign: 'center', margin: 0 }}>
                                    No vendors found.
                                </p>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorManagement;
