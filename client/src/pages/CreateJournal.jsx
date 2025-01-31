import { useState } from "react";
import instance from "../config/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import MarkDown from "../components/MarkDown";

export default function CreateJournal() {
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [aiInsight, setAiInsight] = useState(null);
  const navigate = useNavigate();

  const handleGenerateInsight = async () => {
    console.log("Generating insight...");
    try {
      const { data } = await instance.post(
        "/generate-response",
        {
          userPrompt: content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      // console.log(data, "<-- insight dari AI");

      setAiInsight(data.message);
    } catch (error) {
      toast.error("Gagal generate insight!");
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await instance.post(
        "/journals",
        { content, ai_insight: aiInsight, date },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success("Journal berhasil disimpan!");
      navigate("/");
    } catch (error) {
      toast.error("Gagal menyimpan journal!");
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold text-black mb-4">Buat Journal Baru</h2>
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
            {/* <p>{aiInsight}</p> */}
            <MarkDown text={aiInsight} />
          </div>
        )}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleGenerateInsight}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Generate Insight
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            disabled={!aiInsight} // Harus generate dulu
          >
            Simpan Journal
          </button>
        </div>
      </form>
    </div>
  );
}
