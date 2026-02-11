import React from 'react';
import '../../styles/index.css';

const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    error,
    required = false,
    disabled = false,
    placeholder = 'Select an option',
    className = '',
    ...props
}) => {
    return (
        <div className="form-group">
            {label && (
                <label htmlFor={name} className="form-label">
                    {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={`form-select ${className}`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <div className="form-error">{error}</div>}
        </div>
    );
};

export default Select;
