import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as
    | { success: true; booking: { orderId: string } }
    | { success: false; error: string }
    | undefined;

  if (!state) {
    navigate("/");
    return null;
  }

  return (
    <main className="flex justify-center m-6 items-center bg-white px-4 font-sans">
      <div className="text-center">
        {state.success ? (
          <>
            <Icon icon="ep:success-filled" className="text-green-500 w-16 h-16 mb-4 mx-auto" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Booking Confirmed
            </h1>
            <p className="text-green-600 font-medium bg-green-50 border border-green-200 rounded-md inline-block px-3 py-1 mb-6">
              Ref ID: {state.booking.orderId}
            </p>

            <div>
              <button
                onClick={() => navigate("/")}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 font-medium transition"
              >
                Back to Home
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-red-600 mb-2">
              Booking Failed
            </h1>
            <p className="text-gray-600 mb-6">{state.error}</p>
            <button
              onClick={() => navigate("/checkout")}
              className="px-5 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-md font-medium"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default Result;
