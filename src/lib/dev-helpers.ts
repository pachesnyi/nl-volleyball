// Development helper utilities
export const devProps = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    return {
      'data-component': componentName,
      'data-dev': 'true'
    };
  }
  return {};
};

// Alternative helper for debugging
export const debugProps = (componentName: string, props?: Record<string, string>) => {
  if (process.env.NODE_ENV === 'development') {
    const baseProps = {
      'data-component': componentName,
      'data-dev': 'true'
    };
    
    if (props) {
      Object.entries(props).forEach(([key, value]) => {
        baseProps[`data-debug-${key}` as keyof typeof baseProps] = value;
      });
    }
    
    return baseProps;
  }
  return {};
};