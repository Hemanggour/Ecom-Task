import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helpText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helpText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-main mb-2">
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted z-10">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`input ${icon ? 'pl-14' : ''} ${error ? 'input-error' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-danger text-sm mt-2">{error}</p>}
        {helpText && !error && <p className="text-muted text-sm mt-2">{helpText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
