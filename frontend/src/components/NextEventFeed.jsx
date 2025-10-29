// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {API_BASE} from "../config";
// import "../../static/css/NextEvent.css";
//
// const ENDPOINTS = [
//   // Încearcă pe rând – ajustează/schimbă ordinea după cum ai backend-ul
//   (base) => `${base}/api/concursuri_next`,     // un endpoint dedicat „next event” (opțional)
//   (base) => `${base}/api/concursuri`,          // listă generală de concursuri (opțional)
//   () => `/data/concursuri.json`,               // fallback local (public/data/concursuri.json)
// ];
//
// // normalizăm datele venite din diverse surse
// function normalizeEvents(raw) {
//   if (!raw) return [];
//   // Acceptă formate diverse: [{startDate,title,location,...}] sau [{date_start,...}]
//   return raw
//     .map((e, idx) => ({
//       id: e.id ?? e._id ?? `evt-${idx}`,
//       title: e.title ?? e.nume ?? e.name ?? "Eveniment",
//       start: new Date(e.startDate ?? e.date_start ?? e.data ?? e.start ?? e.when),
//       end: e.endDate ? new Date(e.endDate) : null,
//       city: e.city ?? e.oras ?? e.location ?? "",
//       country: e.country ?? e.tara ?? "",
//       image: e.image ?? e.bannerUrl ?? e.cover ?? "",
//       url: e.url ?? e.link ?? null,
//       mapUrl: e.mapUrl ?? e.gmap ?? null,
//     }))
//     .filter((e) => !isNaN(e.start?.getTime()));
// }
//
// function useUpcomingEvents(limit = 3) {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     let active = true;
//     (async () => {
//       setLoading(true);
//       for (const buildUrl of ENDPOINTS) {
//         try {
//           const url = buildUrl(API_BASE || "");
//           const res = await fetch(url, { credentials: "include" }).catch(() => null);
//           if (!res || !res.ok) continue;
//           const data = await res.json();
//           if (!active) return;
//           const items = normalizeEvents(Array.isArray(data) ? data : data?.items || data?.results || []);
//           const now = new Date();
//           const upcoming = items
//             .filter((e) => e.start.getTime() >= now.getTime() - 60 * 1000) // ≥ acum (toleranță 1 min)
//             .sort((a, b) => a.start - b.start)
//             .slice(0, limit);
//           setEvents(upcoming);
//           setLoading(false);
//           return;
//         } catch (_) {
//           /* încearcă următorul endpoint */
//         }
//       }
//       if (active) setLoading(false);
//     })();
//     return () => {
//       active = false;
//     };
//   }, [limit]);
//
//   return { events, loading };
// }
//
// function useCountdown(targetDate) {
//   const [now, setNow] = useState(() => new Date());
//   const timerRef = useRef(null);
//
//   useEffect(() => {
//     timerRef.current = setInterval(() => setNow(new Date()), 1000);
//     return () => clearInterval(timerRef.current);
//   }, []);
//
//   const diff = Math.max(0, targetDate.getTime() - now.getTime());
//   const totalSec = Math.floor(diff / 1000);
//   const days = Math.floor(totalSec / (24 * 3600));
//   const hours = Math.floor((totalSec % (24 * 3600)) / 3600);
//   const minutes = Math.floor((totalSec % 3600) / 60);
//   const seconds = totalSec % 60;
//
//   return { days, hours, minutes, seconds, finished: diff <= 0 };
// }
//
// function pad(n) {
//   return String(n).padStart(2, "0");
// }
//
// function NextCard({ event, highlight = false }) {
//   const { days, hours, minutes, seconds, finished } = useCountdown(event.start);
//   const dtLabel = useMemo(
//     () =>
//       event.start.toLocaleDateString("ro-RO", {
//         weekday: "long",
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       }),
//     [event.start]
//   );
//
//   return (
//     <article className={`next-card ${highlight ? "next-card--highlight" : ""}`}>
//       <div className="next-card__media">
//         {event.image ? (
//           <img src={event.image} alt={event.title} />
//         ) : (
//           <div className="next-card__placeholder" aria-hidden />
//         )}
//         <div className="next-card__badge">Următorul concurs</div>
//       </div>
//
//       <div className="next-card__body">
//         <h3 className="next-card__title">{event.title}</h3>
//         <p className="next-card__meta">
//           <i className="fas fa-calendar-alt" aria-hidden /> {dtLabel}
//           {event.city ? (
//             <>
//               {" • "}
//               <i className="fas fa-map-marker-alt" aria-hidden /> {event.city}
//               {event.country ? `, ${event.country}` : ""}
//             </>
//           ) : null}
//         </p>
//
//         <div className="countdown">
//           {finished ? (
//             <span className="countdown__done">A început!</span>
//           ) : (
//             <>
//               <div className="cd-box">
//                 <span className="cd-num">{days}</span>
//                 <span className="cd-lbl">zile</span>
//               </div>
//               <div className="cd-box">
//                 <span className="cd-num">{pad(hours)}</span>
//                 <span className="cd-lbl">ore</span>
//               </div>
//               <div className="cd-box">
//                 <span className="cd-num">{pad(minutes)}</span>
//                 <span className="cd-lbl">min</span>
//               </div>
//               <div className="cd-box">
//                 <span className="cd-num">{pad(seconds)}</span>
//                 <span className="cd-lbl">sec</span>
//               </div>
//             </>
//           )}
//         </div>
//
//         <div className="next-card__actions">
//           {event.url && (
//             <a className="btn btn-primary" href={event.url} target="_blank" rel="noreferrer">
//               Detalii / Înscrieri
//             </a>
//           )}
//           {event.mapUrl && (
//             <a className="btn btn-ghost" href={event.mapUrl} target="_blank" rel="noreferrer">
//               Google Maps
//             </a>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// }
//
// export default function NextEventFeed() {
//   const { events, loading } = useUpcomingEvents(3);
//
//   if (loading) {
//     return (
//       <section className="next-wrapper" aria-busy="true">
//         <div className="next-skel" />
//       </section>
//     );
//   }
//
//   if (!events.length) {
//     return (
//       <section className="next-wrapper">
//         <div className="next-empty">
//           Nu există concursuri viitoare în calendar. Revino curând!
//         </div>
//       </section>
//     );
//   }
//
//   const [first, ...rest] = events;
//
//   return (
//     <section className="next-wrapper" aria-label="Următoarele concursuri">
//       <div className="next-grid">
//         <NextCard event={first} highlight />
//         {rest.map((e) => (
//           <NextCard key={e.id} event={e} />
//         ))}
//       </div>
//     </section>
//   );
// }
