import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config";
import "../../static/css/NextEvent.css";

// Funcție care încearcă să înțeleagă diverse formate de dată
function parseSmartDate(dateStr) {
  if (!dateStr) return null;
  const cleanStr = dateStr.trim();

  // 1. ÎNCERCARE FORMAT NUMERIC (Ca în poza ta: "21.02 – 21.02.2026" sau "24.01.2026")
  // Regex explicat: Caută "cifre.cifre" la început ... și apoi "4 cifre" (anul) oriunde mai încolo
  const numericMatch = cleanStr.match(/^(\d{1,2})\.(\d{1,2}).*?(\d{4})/);

  if (numericMatch) {
      const day = parseInt(numericMatch[1], 10);
      const month = parseInt(numericMatch[2], 10) - 1; // În JS lunile sunt 0-11 (Ianuarie e 0)
      const year = parseInt(numericMatch[3], 10);

      const d = new Date(year, month, day);
      // Validăm că a ieșit o dată reală
      if (!isNaN(d.getTime())) {
          return d;
      }
  }

  // 2. ÎNCERCARE STANDARD (ISO sau text englezesc)
  const stdDate = new Date(dateStr);
  if (!isNaN(stdDate.getTime())) {
      return stdDate;
  }

  return null;
}

// Funcție pentru a curăța și standardiza datele
function normalizeEvents(raw) {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : (raw.items || raw.results || []);

  return list
    .map((e, idx) => {
      // Luăm textul brut al datei
      const rawDate = e.data_start || e.startDate || e.data || e.perioada;

      // Îl transformăm în obiect Date folosind funcția noastră deșteaptă
      const parsedDate = parseSmartDate(rawDate);

      // DEBUG: Poți decomenta linia de mai jos ca să vezi în consolă (F12) cum citește datele
      // console.log(`Eveniment: ${e.nume}, Text: "${rawDate}" -> Data:`, parsedDate);

      return {
        id: e.id ?? `evt-${idx}`,
        title: e.nume || e.title || "Eveniment Hwarang",
        start: parsedDate,
        rawDateString: rawDate, // Păstrăm textul original pentru afișare
        location: e.locatie || e.city || "Sibiu",
        image: e.image || null,
        url: e.link || null
      };
    })
    // Păstrăm doar evenimentele unde am reușit să descifrăm data
    .filter((e) => e.start !== null && !isNaN(e.start.getTime()));
}

function useUpcomingEvents() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/concursuri`);
        if (res.ok) {
            const data = await res.json();
            const items = normalizeEvents(data);
            const now = new Date();

            // Setăm ora la 00:00:00 pentru comparație corectă cu ziua de azi
            now.setHours(0, 0, 0, 0);

            // Filtrăm evenimentele viitoare (sau cele de azi)
            // Toleranță: le mai afișăm încă 24h după ce au început
            const upcoming = items
                .filter(e => e.start.getTime() >= now.getTime() - (24 * 60 * 60 * 1000))
                .sort((a, b) => a.start - b.start); // Cel mai apropiat primul

            if (active) {
                setEvent(upcoming[0] || null); // Luăm primul din listă
            }
        }
      } catch (err) {
        console.error("Eroare NextEvent:", err);
      }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return { event, loading };
}

function useCountdown(targetDate) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };

  const diff = targetDate.getTime() - now.getTime();
  const finished = diff <= 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, finished };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function NextEventFeed() {
  const { event, loading } = useUpcomingEvents();

  if (loading) return null;
  if (!event) return null; // Dacă nu e niciun concurs, nu afișăm nimic

  return <NextEventCard event={event} />;
}

function NextEventCard({ event }) {
  const { days, hours, minutes, seconds, finished } = useCountdown(event.start);

  // Afișăm textul original din baza de date (ex: "21.02 – 21.02.2026")
  const dateDisplay = event.rawDateString || event.start.toLocaleDateString("ro-RO");

  return (
    <div className="next-event-wrapper">
      <div className="next-event-card">
        <div className="live-badge">
            <span className="pulse-dot"></span> Următorul Concurs
        </div>

        <div className="ne-content">
            <h2 className="ne-title">{event.title}</h2>

            <div className="ne-meta">
                <div className="ne-meta-item">
                    <i className="fas fa-calendar-day"></i>
                    <span>{dateDisplay}</span>
                </div>
                <div className="ne-meta-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{event.location}</span>
                </div>
            </div>

            <div className="ne-timer">
                {finished ? (
                    <div className="ne-started">
                        <i className="fas fa-flag-checkered"></i> Eveniment în desfășurare!
                    </div>
                ) : (
                    <>
                        <div className="timer-box">
                            <span className="t-val">{days}</span>
                            <span className="t-lbl">Zile</span>
                        </div>
                        <div className="timer-sep">:</div>
                        <div className="timer-box">
                            <span className="t-val">{pad(hours)}</span>
                            <span className="t-lbl">Ore</span>
                        </div>
                        <div className="timer-sep">:</div>
                        <div className="timer-box">
                            <span className="t-val">{pad(minutes)}</span>
                            <span className="t-lbl">Min</span>
                        </div>
                        <div className="timer-sep">:</div>
                        <div className="timer-box">
                            <span className="t-val is-red">{pad(seconds)}</span>
                            <span className="t-lbl">Sec</span>
                        </div>
                    </>
                )}
            </div>
        </div>

        {/*<div className="ne-action">*/}
        {/*    <Link to="/concursuri" className="btn-participa">*/}
        {/*        Detalii și Înscriere <i className="fas fa-arrow-right"></i>*/}
        {/*    </Link>*/}
        {/*</div>*/}

        {/* Background Icon */}
        <div className="ne-bg-icon">
            <i className="fas fa-trophy"></i>
        </div>
    </div>
    </div>
  );
}