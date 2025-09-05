// "use client";
// import { useState, useMemo, useCallback } from "react";
// import { FiSearch, FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";

// export type Schedule = {
//   id: string;
//   startDate: string; // YYYY-MM-DD
//   endDate: string; // YYYY-MM-DD
//   startTime: string; // HH:MM
//   endTime: string; // HH:MM
//   createdAt: string; // ISO
//   title?: string;
//   notes?: string;
// };

// type Props = {
//   schedules: Schedule[];
// };

// const PAGE_SIZE_OPTIONS = [5, 10, 20];

// const formatDate = (iso: string) => {
//   const d = new Date(iso);
//   return d.toLocaleDateString(undefined, {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// };

// const ViewSchedules: React.FC<Props> = ({ schedules }) => {
//   const [search, setSearch] = useState("");
//   const [sortKey, setSortKey] = useState<keyof Schedule>("createdAt");
//   const [sortAsc, setSortAsc] = useState(false);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [selected, setSelected] = useState<Schedule | null>(null);

//   //   const filtered = useMemo(() => {
//   //     return schedules
//   //       .filter((s) => {
//   //         const term = search.toLowerCase();
//   //         return (
//   //           s.id.toLowerCase().includes(term) ||
//   //           (s.title?.toLowerCase().includes(term) ?? false) ||
//   //           s.startDate.includes(term) ||
//   //           s.endDate.includes(term)
//   //         );
//   //       })
//   //       .sort((a, b) => {
//   //         const aVal = a[sortKey];
//   //         const bVal = b[sortKey];
//   //         if (aVal === bVal) return 0;
//   //         let cmp: number;
//   //         if (typeof aVal === "string" && typeof bVal === "string") {
//   //           // date strings or normal strings
//   //           cmp = aVal.localeCompare(bVal);
//   //         } else {
//   //           cmp = String(aVal).localeCompare(String(bVal));
//   //         }
//   //         return sortAsc ? cmp : -cmp;
//   //       });
//   //   }, [schedules, search, sortKey, sortAsc]);

//   //   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   //   const paginated = useMemo(() => {
//   //     const start = (page - 1) * pageSize;
//   //     return filtered.slice(start, start + pageSize);
//   //   }, [filtered, page, pageSize]);

//   const toggleSort = (key: keyof Schedule) => {
//     if (sortKey === key) setSortAsc((s) => !s);
//     else {
//       setSortKey(key);
//       setSortAsc(true);
//     }
//   };

//   const resetSelection = useCallback(() => setSelected(null), []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0f0d1f] to-[#1f103f] p-6 flex gap-8">
//       {/* Main table area */}
//       <div className="flex-1 flex flex-col">
//         <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-4xl font-extrabold text-white">
//               View Schedules
//             </h1>
//             <p className="text-sm text-violet-200 mt-1">
//               Browse, search, sort, and inspect all your created schedules.
//               Click a row to see details.
//             </p>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
//             <div className="relative">
//               <input
//                 aria-label="Search schedules"
//                 placeholder="Search by title, date, or id..."
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);
//                   setPage(1);
//                 }}
//                 className="pl-10 pr-4 py-2 rounded-full bg-[#1c123b] text-white placeholder:text-violet-400 border border-[#3e2a70] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#b895ff] w-full sm:w-64"
//               />
//               <div className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-300">
//                 <FiSearch />
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <div className="flex items-center gap-1 text-sm text-violet-200">
//                 <span>Per page:</span>
//                 <select
//                   value={pageSize}
//                   onChange={(e) => {
//                     setPageSize(Number(e.target.value));
//                     setPage(1);
//                   }}
//                   className="bg-[#1c123b] text-white px-3 py-2 rounded-lg border border-[#3e2a70] outline-none"
//                 >
//                   {PAGE_SIZE_OPTIONS.map((o) => (
//                     <option key={o} value={o}>
//                       {o}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex items-center gap-1 text-sm text-violet-200">
//                 <span>
//                   {filtered.length} result{filtered.length !== 1 ? "s" : ""}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto rounded-xl bg-[#1d1445] border border-[#3e2a70] shadow-md flex-1">
//           <table className="w-full table-auto text-left">
//             <thead className="bg-[#2a1e57]">
//               <tr>
//                 {[
//                   {
//                     label: "Title",
//                     key: "title" as keyof Schedule,
//                     width: "w-[25%]",
//                   },
//                   {
//                     label: "Start",
//                     key: "startDate" as keyof Schedule,
//                     width: "w-[15%]",
//                   },
//                   {
//                     label: "End",
//                     key: "endDate" as keyof Schedule,
//                     width: "w-[15%]",
//                   },
//                   {
//                     label: "Window",
//                     key: "startTime" as keyof Schedule,
//                     width: "w-[15%]",
//                   },
//                   {
//                     label: "Created",
//                     key: "createdAt" as keyof Schedule,
//                     width: "w-[15%]",
//                   },
//                   {
//                     label: "ID",
//                     key: "id" as keyof Schedule,
//                     width: "w-[15%]",
//                   },
//                 ].map(({ label, key, width }) => (
//                   <th
//                     key={key}
//                     className={`px-4 py-3 ${width} cursor-pointer select-none font-medium text-sm text-violet-100`}
//                     onClick={() => toggleSort(key)}
//                   >
//                     <div className="flex items-center gap-1">
//                       {label}
//                       {sortKey === key && (
//                         <span className="flex-none">
//                           {sortAsc ? <FiChevronUp /> : <FiChevronDown />}
//                         </span>
//                       )}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {paginated.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={6}
//                     className="px-6 py-12 text-center text-violet-300"
//                   >
//                     No schedules match your search.
//                   </td>
//                 </tr>
//               )}
//               {paginated.map((s) => (
//                 <tr
//                   key={s.id}
//                   onClick={() => setSelected(s)}
//                   className="border-b last:border-b-0 cursor-pointer hover:bg-[#2f1c78] transition"
//                 >
//                   <td className="px-4 py-3">
//                     <div className="text-white font-medium">
//                       {s.title || "Untitled"}
//                     </div>
//                     <div className="text-xs text-violet-300 mt-1">
//                       {s.notes || ""}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="text-sm text-violet-100">
//                       {formatDate(s.startDate)}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="text-sm text-violet-100">
//                       {formatDate(s.endDate)}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="text-sm text-violet-100">
//                       {s.startTime} - {s.endTime}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="text-sm text-violet-100">
//                       {formatDate(s.createdAt)}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="text-xs text-violet-300 truncate max-w-[120px]">
//                       {s.id}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination controls */}
//         <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <div className="text-sm text-violet-200">
//             Page {page} of {totalPages}
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="px-4 py-2 bg-[#2a1e57] text-white rounded-lg disabled:opacity-40 flex items-center gap-1"
//             >
//               Prev
//             </button>
//             <button
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page === totalPages}
//               className="px-4 py-2 bg-[#2a1e57] text-white rounded-lg disabled:opacity-40 flex items-center gap-1"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Detail drawer */}
//       {selected && (
//         <div className="w-full max-w-md bg-[#1f1042] border border-[#5f3dc4] rounded-2xl p-6 flex flex-col relative shadow-xl">
//           <button
//             aria-label="Close"
//             onClick={resetSelection}
//             className="absolute top-4 right-4 text-violet-200 hover:text-white"
//           >
//             <FiX size={20} />
//           </button>
//           <h2 className="text-2xl font-bold text-white mb-1">
//             {selected.title || "Schedule Details"}
//           </h2>
//           <p className="text-xs uppercase tracking-wide text-violet-300 mb-4">
//             Created: {formatDate(selected.createdAt)}
//           </p>

//           <div className="space-y-4 flex-1 overflow-auto">
//             <div className="flex justify-between bg-[#2a1e57] rounded-lg p-3">
//               <div>
//                 <div className="text-xs text-violet-300 uppercase">Start</div>
//                 <div className="text-lg text-white">
//                   {formatDate(selected.startDate)} {selected.startTime}
//                 </div>
//               </div>
//               <div>
//                 <div className="text-xs text-violet-300 uppercase">End</div>
//                 <div className="text-lg text-white">
//                   {formatDate(selected.endDate)} {selected.endTime}
//                 </div>
//               </div>
//             </div>

//             {selected.notes && (
//               <div className="bg-[#2a1e57] rounded-lg p-4">
//                 <div className="text-sm font-medium text-violet-100 mb-1">
//                   Notes
//                 </div>
//                 <div className="text-sm text-white">{selected.notes}</div>
//               </div>
//             )}

//             <div className="bg-[#2a1e57] rounded-lg p-4">
//               <div className="text-sm font-medium text-violet-100 mb-1">
//                 Raw Payload
//               </div>
//               <pre className="bg-[#0f0d1f] rounded-md p-3 text-xs overflow-x-auto text-[#e0d8ff]">
//                 {JSON.stringify(selected, null, 2)}
//               </pre>
//             </div>
//           </div>

//           <button
//             onClick={() => {
//               // placeholder for edit or action
//               alert("Edit or perform action");
//             }}
//             className="mt-6 w-full px-5 py-3 bg-gradient-to-r from-[#c073ff] to-[#8f49ff] text-white font-semibold rounded-2xl shadow hover:scale-[1.02] transition"
//           >
//             Edit Schedule
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewSchedules;
