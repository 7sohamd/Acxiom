import React from 'react';
import '../../styles/index.css';

const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <div className={`glass-card ${hover ? '' : ''} ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;
