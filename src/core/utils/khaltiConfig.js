import KhaltiCheckout from "khalti-checkout-web";

const config = {
    publicKey: "8d28b7de3e4a4a408fc6aeddab0cb860",
    productIdentity: "1234567890",
    productName: "My Product",
    productUrl: "http://localhost:3000/",
    eventHandler: {
        onSuccess(payload) {
            console.log("Payment successful:", payload);
            // Pass payload.token and payload.amount to the backend for verification
            fetch("/api/khalti/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: payload.token, amount: payload.amount }),
            })
                .then((res) => res.json())
                .then((data) => console.log("Verification response:", data))
                .catch((err) => console.error("Verification error:", err));
        },
        onError(error) {
            console.error("Payment error:", error);
        },
        onClose() {
            console.log("Widget closed.");
        },
    },
    paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
};

export default function payWithKhalti(amount) {
    const checkout = new KhaltiCheckout(config);
    checkout.show({ amount });
}
