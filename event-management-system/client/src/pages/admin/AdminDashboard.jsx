import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import '../../styles/index.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    return (
        <div className="page-wrapper">
            <div className="container-sm fade-in">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 'var(--space-2xl)'
                }}>
                    <h1>Welcome Admin</h1>
                    <Button variant="secondary" onClick={() => logout()}>
                        Log Out
                    </Button>
                </div>

                <Card>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 'var(--space-lg)'
                    }}>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/admin/users')}
                        >
                            Maintain User
                        </Button>

                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/admin/vendors')}
                        >
                            Maintain Vendor
                        </Button>

                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/admin/memberships')}
                            style={{ gridColumn: 'span 2' }}
                        >
                            Membership Management
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
