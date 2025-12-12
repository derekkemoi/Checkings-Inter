const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001/api';

export const initiatePayment = async (
  uid: string,
  email: string,
  amount: number,
  currency: string,
  purpose: string[]
) => {
  const amountInSmallestUnit = Math.floor(amount * 100);

  const response = await fetch(`${API_URL}/payment/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid,
      email,
      amount: amountInSmallestUnit,
      currency,
      purpose
    }),
  });

  if (!response.ok) {
    throw new Error('Payment initiation failed');
  }

  return response.json();
};

export const verifyPayment = async (reference: string, uid: string) => {
  const response = await fetch(`${API_URL}/payment/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reference, uid }),
  });

  console.log('Verify payment response status:', response.ok);

  if (!response.ok) {
    throw new Error('Payment verification failed');
  }

  return response.json();
};
