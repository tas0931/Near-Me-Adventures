import { useState, useCallback } from 'react';

export function useConfirm() {
  const [state, setState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
  });

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title: options.title || 'Confirm Action',
        message: options.message || 'Are you sure?',
        type: options.type || 'danger',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        onConfirm: () => {
          setState(s => ({ ...s, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setState(s => ({ ...s, isOpen: false }));
          resolve(false);
        },
      });
    });
  }, []);

  return { confirmState: state, confirm };
}
