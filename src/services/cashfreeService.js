/**
 * Cashfree Payment Gateway Integration Service
 * 
 * Ready to connect to Cashfree Production / Sandbox REST APIs:
 * - https://sandbox.cashfree.com/pg/orders
 * - https://api.cashfree.com/pg/orders
 */

export const CASHFREE_CONFIG = {
  mode: 'sandbox', // 'sandbox' or 'production'
  appId: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CASHFREE_APP_ID) || 'TEST_APP_ID_KALAAKSHI',
  version: '2023-08-01'
};

/**
 * Initializes Cashfree Dropin SDK or executes mock payment session for client testing
 */
export async function initializeCashfreePayment({ orderId, orderAmount, customerDetails, paymentMethod = 'upi' }) {
  // In production, your backend calls https://sandbox.cashfree.com/pg/orders to get payment_session_id
  const paymentSessionId = `session_klk_${orderId}_${Date.now()}`;

  return new Promise((resolve) => {
    // Simulate Cashfree gateway network latency
    setTimeout(() => {
      resolve({
        status: 'SUCCESS',
        paymentSessionId,
        orderId,
        orderAmount,
        transactionId: `tx_cf_${Math.floor(10000000 + Math.random() * 90000000)}`,
        paymentMethod,
        paidAt: new Date().toISOString()
      });
    }, 1200);
  });
}
