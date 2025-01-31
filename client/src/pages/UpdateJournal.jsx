import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import instance from "../config/axiosInstance";
import { toast } from "react-toastify";
import Markdown from "../components/MarkDown";

export default function UpdateJournal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [aiInsight, setAiInsight] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch data journal berdasarkan ID
  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const { data } = await instance.get(`/journals/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        // console.log(data.ai_insight, "<-- AI insight nih bro");

        setContent(data.content);
        setDate(new Date(data.date).toLocaleDateString("en-CA"));
        setAiInsight(data.ai_insight || "Belum ada insight.");
      } catch (error) {
        toast.error("Gagal mengambil data journal!");
        console.log(error, "<-- Error fetch journal");
      }
    };
    fetchJournal();
  }, [id]);

  const handleGenerateInsight = async () => {
    if (!content.trim()) {
      toast.warning("Isi journal tidak boleh kosong!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await instance.post(
        "/ai/generate-insight",
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setAiInsight(data.insight);
      toast.success("Insight berhasil dibuat!");
    } catch (error) {
      toast.error("Gagal generate insight!");
      console.log(error, "<-- Error generate insight");
    }
    setLoading(false);
  };

  // Handle submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance.put(
        `/journals/${id}`,
        { content, date, aiInsight },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success("Journal berhasil diperbarui!");
      navigate("/");
    } catch (error) {
      toast.error("Gagal memperbarui journal!");
      console.log(error, "<-- Error update journal");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-black mb-4">Update Journal</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="content">
            Isi Journal
          </label>
          <textarea
            className="w-full p-2 border rounded text-black"
            rows="4"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="date">
            Tanggal
          </label>
          <input
            type="date"
            id="date"
            className="w-full p-2 border rounded text-black"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        {aiInsight && (
          <div className="p-4 bg-gray-100 text-black rounded-lg mb-4">
            <h3 className="font-bold text-black">AI Insight:</h3>
            <Markdown text={aiInsight} />
          </div>
        )}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleGenerateInsight}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Insight"}
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            disabled={!aiInsight}
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
