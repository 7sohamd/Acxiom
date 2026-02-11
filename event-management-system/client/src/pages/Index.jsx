import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import '../styles/index.css';

const Index = () => {
    const navigate = useNavigate();

    return (
        <div className="page-wrapper">
            <div className="container-sm text-center fade-in">
                <h1 style={{ fontSize: 'var(--font-size-5xl)', marginBottom: 'var(--space-md)' }}>
                    Event Management System
                </h1>
                <p style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-2xl)', color: 'var(--gray-300)' }}>
                    Your complete solution for managing events, vendors, and orders
                </p>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/login-selection')}
                >
                    Login
                </Button>
            </div>
        </div>
    );
};

export default Index;
