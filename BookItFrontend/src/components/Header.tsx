import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <header className="w-full shadow-sm sticky top-0 z-50 bg-gray-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4 md:py-2">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700"
        >
          <img className="filter contrast-125 w-auto h-[70px]" src={logo} alt="logo"/>
        </Link>

        <div>
          <form className="mx-2 flex items-center" onSubmit={handleSearch}>
            <input 
              className="bg-gray-200 rounded-sm p-3 px-5 w-[300px] text-gray-800 outline-none" 
              type="text"
              placeholder="Search experiences" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              required
            />
            <button className="ml-3 p-3 px-5 rounded-sm text-zinc-950 bg-amber-300 " type="submit">Search</button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
