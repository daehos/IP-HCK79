import { useEffect, useState } from "react";
import instance from "../config/axiosInstance";
import { toast } from "react-toastify";
import { HoverEffect } from "../components/ui/card-hover-effect";
import Navbar from "../components/ui/Navbar";
import axios from "axios";

export default function Homepage() {
  // const dispatch = useDispatch();
  const [quote, setQuote] = useState("");
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [journals, setJournals] = useState([]);

  const fetchJournals = async () => {
    try {
      const { data } = await instance.get("/journals", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setJournals(data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error, "<-- dari nge fetch journal");
    }
  };

  const fetchQuote = async () => {
    try {
      setLoadingQuote(true);
      const { data } = await axios.get(
        "http://localhost:3000/api/quotes"
      );
      // console.log(data);

      setQuote(data.data.content);
    } catch (error) {
      console.log(error, "<-- error fetch quote");
      setQuote("Gagal mengambil quote, coba lagi nanti.");
    } finally {
      setLoadingQuote(false);
    }
  };

  useEffect(() => {
    fetchJournals();
    fetchQuote();
  }, []);
  return (
    <div className="">
      {/* <Navbar /> */}
      <div className="max-w-5xl mx-auto px-8  ">
        <div className="bg-gray-100 text-black p-4 rounded-lg mb-6 shadow-md">
          <h3 className="font-bold text-lg">Quotes of The Day</h3>
          {loadingQuote ? (
            <p className="text-gray-500">Fetching quote...</p>
          ) : (
            <p className="italic">"{quote}"</p>
          )}
        </div>
        <HoverEffect journals={journals} fetchJournals={fetchJournals} />
      </div>
    </div>
  );
}
