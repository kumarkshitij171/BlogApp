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
            <h2>Payment Successful with reference number: </h2>
            <span>{referenceNum}</span>
        </div>
    )
}

export default PaymentSuccessPage
