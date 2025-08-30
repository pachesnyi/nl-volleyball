'use client';

import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { forwardRef } from 'react';

type ButtonProps = MuiButtonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return (
      <MuiButton
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';