import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const UserManagement = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await adminService.getAllUsers();
            setUsers(data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
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
            if (editingUser) {
                // Update existing user
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password; // Don't update password if empty
                await adminService.updateUser(editingUser._id, updateData);
                alert('User updated successfully!');
            } else {
                // Create new user
                await adminService.createUser(formData);
                alert('User created successfully!');
            }
            setShowForm(false);
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'user' });
            fetchUsers();
        } catch (error) {
            alert('Error: ' + error.response?.data?.message);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role
        });
        setShowForm(true);
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await adminService.deleteUser(userId);
            fetchUsers();
        } catch (error) {
            alert('Error deleting user: ' + error.response?.data?.message);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', role: 'user' });
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'var(--error-light)';
            case 'vendor': return 'var(--info-light)';
            case 'user': return 'var(--success-light)';
            default: return 'var(--gray-200)';
        }
    };

    const roleOptions = [
        { value: 'user', label: 'User' },
        { value: 'vendor', label: 'Vendor' },
        { value: 'admin', label: 'Admin' }
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
                    <h1>User Management</h1>
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        {!showForm && (
                            <Button variant="success" onClick={() => setShowForm(true)}>
                                + Add New User
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
                            {editingUser ? 'Edit User' : 'Add New User'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <Input
                                label="Name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter name"
                                required
                            />
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="user@example.com"
                                required
                            />
                            <Input
                                label={editingUser ? "Password (leave empty to keep current)" : "Password"}
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required={!editingUser}
                            />
                            <Select
                                label="Role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                options={roleOptions}
                                required
                            />
                            <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
                                <Button variant="secondary" onClick={handleCancel} type="button" style={{ flex: 1 }}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit" style={{ flex: 1 }}>
                                    {editingUser ? 'Update User' : 'Create User'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* User List */}
                {loading && <p style={{ color: 'var(--gray-300)' }}>Loading users...</p>}

                {!loading && !showForm && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        {users.map((user) => (
                            <Card key={user._id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                                            <h3 style={{ margin: 0 }}>{user.name}</h3>
                                            <span style={{
                                                padding: 'var(--space-xs) var(--space-sm)',
                                                background: getRoleBadgeColor(user.role),
                                                color: 'var(--black)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: 'var(--font-size-xs)',
                                                fontWeight: 'var(--font-weight-semibold)',
                                                textTransform: 'uppercase'
                                            }}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <p style={{ color: 'var(--gray-300)', margin: 0 }}>
                                            {user.email}
                                        </p>
                                        <p style={{ color: 'var(--gray-400)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-xs)' }}>
                                            Created: {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleEdit(user)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {users.length === 0 && (
                            <Card>
                                <p style={{ color: 'var(--gray-300)', textAlign: 'center', margin: 0 }}>
                                    No users found.
                                </p>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
