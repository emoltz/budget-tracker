import toast from 'react-hot-toast';

export const addedExpenseToast = () => toast.success('Added expense');
export const deletedExpense = () => toast.error('Deleted expense');
export const updatedExpense = () => toast.success('Updated expense');