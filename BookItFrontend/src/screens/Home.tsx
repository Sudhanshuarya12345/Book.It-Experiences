import { useEffect, useState } from "react";
import { useNavigate , useLocation } from "react-router-dom";
import api from "../api/api";

interface Slot {
  date: string;
  time: string;
  capacity: number;
  booked: number;
}

interface Experience {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  slots: Slot[];
  image?: string;
}

const Home: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filtered, setFiltered] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await api.get("/experiences");
        setExperiences(response.data);
      } catch (err) {
        console.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filteredList = experiences.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchQuery) ||
          exp.location.toLowerCase().includes(searchQuery)
      );
      setFiltered(filteredList);
    } else {
      setFiltered(experiences);
    }
  }, [searchQuery, experiences]);

  const goToDetails = (id: string) => {
    navigate(`/details/${id}`);
  };

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading experiences...</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-4 flex justify-center min-h-screen font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">

        {filtered.length > 0 ? (
          filtered.map((exp) => (
            <div 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-[312px] my-2" 
              key={exp._id}
            >
              <img 
                className="w-full h-[170px] contain-content" 
                src={exp.image} 
                alt={exp.title}
              />
              {/* overview */}
              <div className="p-2 bg-slate-100 font-sans rounded-b-sm">
                <div className="p-2 space-y-2">
                  <div className="flex justify-between">
                    <div className="text-black font-semibold text-[16px] truncate">{exp.title}</div>
                    <a className="bg-slate-300 p-1 px-2 rounded-[4px] text-[11px] truncate">{exp.location}</a>
                  </div>
                  <p className="text-gray-800 text-[12px] line-clamp-2">{exp.description}</p>
                </div>
                <div className="flex justify-between p-2">
                  <div className="flex flex-row items-center">From <p className="pl-2 font-bold font-black text-2xl ">{exp.price}</p></div>
                  <button 
                    className="bg-amber-300 p-2 font-semibold" 
                    type="button" 
                    onClick={() => goToDetails(exp._id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-4 text-gray font-bold text-2xl sm:text-4xl md:text-6xl lg:text-7xl">
            No experiences found for "{searchQuery}"
          </p>
        )}

      </div>
    </main>
  );
};

export default Home;



