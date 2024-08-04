import { useEffect } from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"

const PaymentSuccessPage = () => {
    const seachQuery = useSearchParams()[0]
    const referenceNum = seachQuery.get("reference")
    const navigate = useNavigate()

    useEffect(() => {
        // console.log(referenceNum)
        if (!referenceNum) navigate("/")
    }, [])
    return (
        <div>
            {/* Payment Page => Provider ``Stripe or Razorpay`` will be used here. */}
            <div className="flex flex-col items-center justify-center p-8 max-w-xl mx-auto border border-black shadow-md rounded-lg mt-12">
                <div className="text-5xl text-green-500 mb-4">✔</div>
                <h1 className="text-2xl font-semibold mb-4">Payment Successful!</h1>
                <p className="text-center mb-6">Thank you for your payment. Your transaction was completed successfully.</p>
                <div className="text-left mb-8">
                    <p><strong>Amount:</strong> 100</p>
                    <p><strong>Payment Method:</strong> UPI</p>
                    <p><strong>Transaction ID:</strong> {referenceNum}</p>
                </div>
                <button
                    className="bg-black text-white py-2 px-4 rounded"
                    onClick={() => navigate("/")}
                >
                    Go to Homepage
                </button>
            </div>
        </div>
    )
}

export default PaymentSuccessPage
