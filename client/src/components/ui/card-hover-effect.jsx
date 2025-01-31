import { AnimatePresence, motion } from "framer-motion";
// import Link from "next/link";
import { useState } from "react";
import { cn } from "../../../lib/utils";
import { Link } from "react-router";
import instance from "../../config/axiosInstance";
import { toast } from "react-toastify";

export const HoverEffect = ({ journals, className, fetchJournals }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);
  // const [journalList, setJournalList] = useState(journals);

  async function handleDelete(e, id) {
    e.preventDefault();
    try {
      const { data } = await instance.delete(`journals/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      toast.success("Journal deleted succesfully");
      console.log("Fetching updated journal list...");
      

      await fetchJournals();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10",
        className
      )}
    >
      {journals.map((journal, idx) => (
        <Link
          to={`/edit-journals/${journal.id}`}
          href={journal?.link}
          key={journal?.id}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>
              {idx + 1}.{" "}
              {new Date(journal.date).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </CardTitle>
            <CardDescription>{journal.content}</CardDescription>
            <button
              className="btn btn-error p-5 mt-2 "
              onClick={(e) => handleDelete(e, journal.id)}
            >
              Delete
            </button>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({ className, children }) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
