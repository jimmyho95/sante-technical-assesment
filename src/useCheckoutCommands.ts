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


  return {
    executeCommand,
    undo,
    redo,
  };
};