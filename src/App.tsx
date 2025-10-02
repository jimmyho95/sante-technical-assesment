import React, { useState } from 'react';
import { useCheckoutCommands } from './useCheckoutCommands';
import { calculateTotals } from './calculations';
import { PRODUCTS } from './types';
import { Payment } from './types';

function App() {
  const {
    cart,
    groupDiscounts,
    taxRate,
    payments,
    canUndo,
    canRedo,
    executeCommand,
    undo,
    redo,
    addProductCommand,
    applyDiscountCommand,
    applyGroupDiscountCommand,
    updateTaxRateCommand,
    addPaymentCommand,
  } = useCheckoutCommands();

  const [paymentType, setPaymentType] = useState<Payment['type']>('credit');
  const [paymentAmount, setPaymentAmount] = useState('');

  const totals = calculateTotals(cart, groupDiscounts, taxRate, payments);

  const handleAddPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (amount > 0 && !isNaN(amount)) {
      executeCommand(addPaymentCommand(paymentType, amount));
      setPaymentAmount('');
    }
  };

  const handleApplyDiscount = (productId: string, value: string) => {
    const discount = parseFloat(value);
    if (discount >= 0 && discount <= 100 && !isNaN(discount)) {
      executeCommand(applyDiscountCommand(productId, discount));
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4 pb-3 border-b">
        <h1 className="text-2xl font-bold">Santé Checkout Register</h1>
        <div className="flex gap-2">
          <button onClick={undo} disabled={!canUndo} className="px-3 py-1 bg-blue-500 text-white disabled:opacity-50">
            Undo
          </button>
          <button onClick={redo} disabled={!canRedo} className="px-3 py-1 bg-blue-500 text-white disabled:opacity-50">
            Redo
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold mb-2">Products</h2>
          {PRODUCTS.map(product => (
            <button
              key={product.id}
              onClick={() => executeCommand(addProductCommand(product))}
              className="w-full flex justify-between p-2 mb-2 bg-gray-100 hover:bg-gray-200"
            >
              <span>{product.name}</span>
              <span>${product.price.toFixed(2)}</span>
            </button>
          ))}

          <h2 className="font-semibold mt-4 mb-2">Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Empty</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="p-2 mb-2 bg-gray-100">
                <div className="flex justify-between">
                  <div>
                    <div>{item.product.name}</div>
                    <div className="text-sm text-gray-600">
                      ${item.product.price.toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <div>${(item.product.price * item.quantity * (1 - item.discount / 100)).toFixed(2)}</div>
                </div>
                <input
                  type="number"
                  placeholder="Discount %"
                  className="w-full mt-1 px-2 py-1 text-sm border"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleApplyDiscount(item.id, e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                {item.discount > 0 && <span className="text-sm text-green-600">{item.discount}% off</span>}
              </div>
            ))
          )}
        </div>

        <div>
          <h2 className="font-semibold mb-2">Actions</h2>
          <button
            onClick={() => executeCommand(applyGroupDiscountCommand())}
            disabled={cart.length < 2}
            className="w-full mb-2 px-3 py-2 bg-purple-500 text-white disabled:bg-gray-300"
          >
            Apply 10% Group Discount
          </button>
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              step="0.1"
              value={taxRate}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0) {
                  executeCommand(updateTaxRateCommand(val));
                }
              }}
              className="flex-1 px-2 py-2 border"
            />
            <span className="px-3 py-2 bg-gray-100">{taxRate}%</span>
          </div>

          <h2 className="font-semibold mb-2">Summary</h2>
          <div className="p-3 mb-4 bg-gray-100">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.groupDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-${totals.groupDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${totals.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t mt-2">
              <span>Total:</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>

          <h2 className="font-semibold mb-2">Payment</h2>
          <select value={paymentType} onChange={(e) => setPaymentType(e.target.value as Payment['type'])} className="w-full mb-2 px-2 py-2 border">
            <option value="cash">Cash</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
            <option value="giftcard">Gift Card</option>
          </select>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              step="0.01"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="Amount"
              className="flex-1 px-2 py-2 border"
            />
            <button onClick={handleAddPayment} className="px-4 py-2 bg-blue-500 text-white">
              Add
            </button>
          </div>

          {payments.length > 0 && (
            <div className="mb-2">
              {payments.map(payment => (
                <div key={payment.id} className="flex justify-between p-2 bg-gray-50 text-sm">
                  <span>{payment.type}</span>
                  <span>${payment.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="p-2 bg-gray-100">
            <div className="flex justify-between text-sm">
              <span>Paid:</span>
              <span>${totals.paid.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between font-bold ${totals.remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
              <span>{totals.remaining > 0 ? 'Remaining' : 'Complete'}</span>
              <span>${totals.remaining.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;