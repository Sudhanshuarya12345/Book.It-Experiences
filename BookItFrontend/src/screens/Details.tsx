import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import api from "../api/api";

type Slot = {
  _id: string;
  date: string;
  time: string;
  capacity: number;
  booked: number;
};

type ExperienceDetail = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  price: number;
  slots: Slot[];
};

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [experience, setExperience] = useState<ExperienceDetail | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await api.get(`/experiences/${id}`);
        setExperience(response.data);
      } catch (err) {
        console.error("Error fetching experience:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [id]);

  useEffect(() => {
    if (!loading && !experience) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 1500);
  
      return () => clearTimeout(timer);
    }
  }, [loading, experience, navigate]);

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading experience Details...</p>
      </main>
    );
  }
  

  if (!experience) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <p className="text-6xl font-semibold text-red-500 animate-pulse">
          Experience not found. Redirecting to home...
        </p>
      </main>
    );
  }

  const uniqueDates = Array.from(new Set(experience.slots.map((s) => s.date)));

  const filteredSlots =
    selectedDate && experience.slots
      ? experience.slots.filter((slot) => slot.date === selectedDate)
      : [];

  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.06);
  const total = subtotal + taxes;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 font-sans">
      {/* Left Side */}
      <div className="flex-1 space-y-6">
        {/* Back button */}
        <div className="flex items-center mb-4">
          <Link
            to="/"
            className="flex items-center text-gray-800 hover:text-gray-600"
          >
            <Icon icon="ic:round-arrow-back" className="w-5 h-5" />
            <span className="ml-2 font-semibold text-sm">Back</span>
          </Link>
        </div>

        {/* Image Section */}
        {experience.image && (
          <img
            src={experience.image}
            alt={experience.title}
            className="w-full rounded-lg h-[300px] object-cover"
          />
        )}

        {/* Title and description Section*/}
        <div>
          <h1 className="text-2xl font-bold">{experience.title}</h1>
          <p className="mt-2 text-gray-700">{experience.description}</p>
        </div>

        {/* Date Section */}
        <div>
          <h2 className="font-semibold mb-2">Choose Date</h2>
          <div className="flex gap-2 flex-wrap">
            {uniqueDates.map((date) => (
              <button
                key={date}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                className={`px-3 py-2 rounded-md border ${selectedDate === date
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-200 text-gray-800"
                  }`}
              >
                {new Date(date).toDateString()}
              </button>
            ))}
          </div>
        </div>

        {/* time Section */}
        {selectedDate && (
          <div>
            <h2 className="font-semibold mb-2">Choose Time</h2>
            <div className="flex gap-2 flex-wrap">
              {filteredSlots.map((slot) => {
                const remaining = slot.capacity - slot.booked;
                return (
                  <button
                    key={slot._id}
                    disabled={remaining <= 0}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`px-3 py-2 rounded-md border ${selectedTime === slot.time
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-200 text-gray-800"
                      } ${remaining <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {slot.time}{" "}
                    <span className="text-red-600 text-[10px]">
                      {remaining <= 0 ? "Sold Out" : `${remaining} left`}
                      </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              All times are in IST (GMT +5:30)
            </p>
          </div>
        )}

        {/* About */}
        <div>
          <h2 className="font-semibold mb-1">About</h2>
          <p className="text-gray-500 text-sm bg-slate-100 p-2 rounded-[2px]">
            Scenic routes, trained guides, and safety briefing. Minimum age 10.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-[300px] h-[303px] bg-gray-100 p-4 rounded-lg space-y-3 sticky top-40">
        <div className="flex justify-between">
          <span>Starts at</span>
          <span>₹{experience.price}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Quantity</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes</span>
          <span>₹{taxes}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <button
          onClick={() => {
            if (!selectedTime) return;
          
            navigate("/checkout", {
              state: {
                experience: {
                  id: experience._id,
                  title: experience.title,
                  price: experience.price,
                },
                slot: filteredSlots.find(slot => slot.time === selectedTime),
                quantity: quantity,
              },
            });
          }}
          className={`w-full py-2 rounded mt-2 ${
            selectedTime
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
          disabled={!selectedTime}
        >
          Confirm
        </button>
      </div>
    </main>
  );
};

export default Details;
