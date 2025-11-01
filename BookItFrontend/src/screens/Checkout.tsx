import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";

type Slot = {
  _id: string;
  date: string;
  time: string;
};


type Experience = {
  id: string;
  title: string;
  price: number;
};

type LocationState = {
  experience: Experience;
  slot: Slot;
  quantity: number;
};

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state ?? {}) as LocationState | undefined;

  const experience = state?.experience;
  const slot = state?.slot;
  const quantity = state?.quantity || 1;

  const generateOrderId = () => {
    const date = new Date();
    const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `HD-${ymd}-${random}`;
  };

  if (!experience || !slot) {
    setTimeout(() => navigate("/"), 500);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg font-semibold animate-pulse">
          Missing booking information. Redirecting to home...
        </p>
      </div>
    );
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [promo, setPromo] = useState("");
  const [agree, setAgree] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.06);
  const total = subtotal + taxes - discountAmount;

  const applyPromo = async () => {
    if (!promo.trim()) return;
    try {
      const res = await api.post("/bookings/promo/validate", { code: promo });
      if (res.data.valid) {
        setDiscountAmount(res.data.discount);
        setPromoError(null);
      } else {
        setDiscountAmount(0);
        setPromoError("Invalid or expired promo code.");
      }
    } catch {
      setPromoError("Failed to validate promo code.");
    }
  };

  const handleConfirmClick = () => {
    if (!name || !email || !agree) {
      alert("Please fill in all details and agree to terms.");
      return;
    }
    setShowModal(true);
  };

  const handleBooking = async () => {
    if (!name || !email || !agree) return;
  
    setSubmitting(true);
    const orderId = generateOrderId();
    try {
      const payload = {
        name,
        orderId,
        email,
        experienceId: experience.id,
        slot: { date: slot.date, time: slot.time },
        quantity,
        promoCode: promo || null,
        totalprice : total,
      };
  
      const res = await api.post("/bookings", payload);
          
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed to create booking");
      }
  
      navigate("/result", {
        state: {
          success: true,
          booking: {
            orderId,
            name,
            email,
            experience: experience.title,
            date: slot.date,
            time: slot.time,
            quantity,
            total,
          },
        },
      });
    } catch (err) {
      navigate("/result", {
        state: { success: false, error: "Booking failed. Please try again." },
      });
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <main className="flex justify-center items-start gap-10 max-w-6xl mx-auto py-10 px-6 font-sans">
      {/* Left form */}
      <section className="flex-1 bg-white p-8 rounded-lg shadow-md space-y-6">
        <h1 className="text-2xl font-bold mb-2">Checkout</h1>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Promo code</label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <button
              onClick={applyPromo}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Apply
            </button>
          </div>
          {promoError && <p className="text-red-600 text-sm mt-1">{promoError}</p>}
          {discountAmount > 0 && (
            <p className="text-green-600 text-sm mt-1">Discount applied: ₹{discountAmount}</p>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-sm text-gray-700">
            I agree to the terms and safety policy
          </label>
        </div>
      </section>

      {/* Right summary */}
      <aside className="w-[320px] bg-white p-8 rounded-lg shadow-md space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Order Summary</h2>
        <div className="flex justify-between text-gray-600">
          <span>Experience</span>
          <span className="font-medium text-black">{experience.title}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Date</span>
          <span>{slot.date}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Time</span>
          <span>{slot.time}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Qty</span>
          <span>{quantity}</span>
        </div>

        <div className="border-t my-2"></div>

        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Taxes</span>
          <span>₹{taxes}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>- ₹{discountAmount}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={handleConfirmClick}
          disabled={!agree || submitting}
          className={`w-full py-3 rounded-lg mt-4 font-medium ${
            agree
              ? "bg-yellow-400 text-black hover:bg-yellow-500"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {submitting ? "Processing..." : "Pay and Confirm"}
        </button>
      </aside>

      {/* ------------ Confirmation Modal -------------- */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-center mb-4">
              Confirm Your Booking
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Experience:</strong> {experience.title}
              </p>
              <p>
                <strong>Date:</strong> {slot.date}
              </p>
              <p>
                <strong>Time:</strong> {slot.time}
              </p>
              <p>
                <strong>Quantity:</strong> {quantity}
              </p>
              <p>
                <strong>Total Price:</strong> ₹{total}
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm & Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Checkout;
