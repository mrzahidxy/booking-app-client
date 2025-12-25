"use client";


export default function CheckoutSuccess() {


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-2">Thank you for your purchase.</p>
      <p className="text-sm text-gray-600 mt-4">
        {/* Session ID: <code>{session_id}</code> */}
      </p>
    </div>
  );
}
