import React from 'react';
import PropTypes from 'prop-types';
import cn from 'clsx';
import css from './Button.module.css';

export const Button = ({ className, variant, onClick, children, disabled }) => {
  const classes = cn(css.root, {
    [className]: className,
    [css[variant]]: css[variant],
  });
  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;

Button.defaultProps = {
  onClick: () => {},
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.string,
};
