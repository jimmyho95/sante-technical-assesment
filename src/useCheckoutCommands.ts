import { useState } from 'react';
import { Command, Product, CartItem, Payment, DEFAULT_GROUP_DISCOUNT } from './types';

export const useCheckoutCommands = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [groupDiscounts, setGroupDiscounts] = useState<any[]>([]);
  const [taxRate, setTaxRate] = useState(8.5);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [history, setHistory] = useState<Command[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const executeCommand = (command: Command) => {
    command.execute();
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, command]);
    setHistoryIndex(historyIndex + 1);
  };

  const undo = () => {
    if (historyIndex >= 0) {
      history[historyIndex].undo();
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      history[nextIndex].execute();
      setHistoryIndex(nextIndex);
    }
  };

  const addProductCommand = (product: Product): Command => ({
    description: `Add ${product.name}`,
    execute: () => {
      setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { id: product.id, product, quantity: 1, discount: 0 }];
      });
    },
    undo: () => {
      setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing && existing.quantity > 1) {
          return prev.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
        }
        return prev.filter(item => item.id !== product.id);
      });
    }
  });

  const applyDiscountCommand = (productId: string, discount: number): Command => {
    const oldDiscount = cart.find(item => item.id === productId)?.discount || 0;
    return {
      description: `Apply ${discount}% discount`,
      execute: () => {
        setCart(prev =>
          prev.map(item =>
            item.id === productId ? { ...item, discount } : item
          )
        );
      },
      undo: () => {
        setCart(prev =>
          prev.map(item =>
            item.id === productId ? { ...item, discount: oldDiscount } : item
          )
        );
      }
    };
  };

  const applyGroupDiscountCommand = (): Command => {
    const productIds = cart.map(item => item.id);
    const discountId = Date.now().toString();
    return {
      description: 'Apply group discount',
      execute: () => {
        setGroupDiscounts(prev => [
          ...prev,
          { 
            id: discountId, 
            name: 'Multi-Item Deal', 
            percentage: DEFAULT_GROUP_DISCOUNT, 
            productIds 
          }
        ]);
      },
      undo: () => {
        setGroupDiscounts(prev => prev.filter(d => d.id !== discountId));
      }
    };
  };

  const updateTaxRateCommand = (newRate: number): Command => {
    const oldRate = taxRate;
    return {
      description: `Set tax to ${newRate}%`,
      execute: () => setTaxRate(newRate),
      undo: () => setTaxRate(oldRate)
    };
  };

  const addPaymentCommand = (type: Payment['type'], amount: number): Command => {
    const paymentId = Date.now().toString();
    return {
      description: `Add ${type} payment`,
      execute: () => {
        setPayments(prev => [...prev, { id: paymentId, type, amount }]);
      },
      undo: () => {
        setPayments(prev => prev.filter(p => p.id !== paymentId));
      }
    };
  };

  return {
    cart,
    groupDiscounts,
    taxRate,
    payments,
    canUndo: historyIndex >= 0,
    canRedo: historyIndex < history.length - 1,
    executeCommand,
    undo,
    redo,
    addProductCommand,
    applyDiscountCommand,
    applyGroupDiscountCommand,
    updateTaxRateCommand,
    addPaymentCommand,
  };
};