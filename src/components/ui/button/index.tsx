import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: 'large' | 'small' | 'extra-small';
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ loading, size, children, ...rest }) => {
  const buttonClasses = `btn btn-primary ${loading ? 'disabled' : ''} ${size === 'large' ? 'btn-lg' : size === 'small' ? 'btn-sm' : size === 'extra-small' ? 'btn-xs' : ''}`;

  return (
    <button
      className={buttonClasses}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <div className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;