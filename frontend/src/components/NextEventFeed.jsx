import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config";
import "../../static/css/NextEvent.css";

// Hartă pentru acordul gramatical corect al badge-ului.
// Pentru fiecare tip de eveniment: forma frumoasă (cu diacritice) + genul,
// ca să alegem corect "Următorul" (masculin) vs "Următoarea" (feminin).
const TIP_INFO = {
  "competitie": { label: "Competiție", gen: "f" },
  "competiție": { label: "Competiție", gen: "f" },
  "concurs":    { label: "Concurs",    gen: "m" },
  "campionat":  { label: "Campionat",  gen: "m" },
  "cupa":       { label: "Cupă",       gen: "f" },
  "cupă":       { label: "Cupă",       gen: "f" },
  "examen":     { label: "Examen",     gen: "m" },
  "stagiu":     { label: "Stagiu",     gen: "m" },
  "adunare":    { label: "Adunare",    gen: "f" },
  "eveniment":  { label: "Eveniment",  gen: "m" },
};

// Construiește textul badge-ului cu acord gramatical corect.
// Ex: "Competitie" -> "Următoarea Competiție", "Examen" -> "Următorul Examen".
function getBadgeText(tipBrut) {
  const cheie = String(tipBrut || "eveniment").trim().toLowerCase();
  const info = TIP_INFO[cheie] || { label: tipBrut || "Eveniment", gen: "m" };
  const articol = info.gen === "f" ? "Următoarea" : "Următorul";
  return `${articol} ${info.label}`;
}

// Funcție care încearcă să înțeleagă diverse formate de dată
function parseSmartDate(dateStr) {
  if (!dateStr) return null;
  const cleanStr = String(dateStr).trim();

  // 1. ÎNCERCARE FORMAT NUMERIC (ex: "15.03.2026" sau "15.03 - 16.03.2026")
  const numericMatch = cleanStr.match(/^(\d{1,2})\.(\d{1,2}).*?(\d{4})/);

  if (numericMatch) {
      const day = parseInt(numericMatch[1], 10);
      const month = parseInt(numericMatch[2], 10) - 1;
      const year = parseInt(numericMatch[3], 10);

      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
          return d;
      }
  }

  // 2. ÎNCERCARE STANDARD (ex: timestamp PostgreSQL "2026-03-15 10:00:00")
  const stdDate = new Date(cleanStr);
  if (!isNaN(stdDate.getTime())) {
      return stdDate;
  }

  return null;
}

// Funcție pentru a curăța și standardiza datele COMBINATE
function normalizeEvents(raw) {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : (raw.items || raw.results || []);

  return list
    .filter(e => e.activ !== false) // Excludem evenimentele dezactivate
    .map((e, idx) => {
      // FIX 1: am adăugat 'start' (cheia trimisă de /api/calendar/evenimente).
      // Înainte lipsea, deci toate evenimentele din calendar ieșeau cu dată null
      // și erau aruncate de filtrul final.
      const rawDate = e.start || e.data_start || e.startDate || e.data || e.perioada;
      const parsedDate = parseSmartDate(rawDate);
      const titluEveniment = e.titlu || e.nume || e.title || "Eveniment Hwarang";

      // FIX 2: folosim întâi câmpul 'tip' curat venit din backend (calendar_club).
      // Doar dacă lipsește (ex: concursuri vechi din tabela 'concursuri') ghicim din titlu.
      let tip = e.tip || null;
      if (!tip) {
        tip = "Eveniment";
        const titluLower = titluEveniment.toLowerCase();
        if (titluLower.includes("concurs") || titluLower.includes("campionat") || titluLower.includes("cupa")) tip = "Concurs";
        else if (titluLower.includes("examen")) tip = "Examen";
        else if (titluLower.includes("stagiu")) tip = "Stagiu";
        else if (titluLower.includes("adunare")) tip = "Adunare";
      }

      return {
        id: e.id ?? `evt-${idx}`,
        title: titluEveniment,
        typeLabel: tip,
        start: parsedDate,
        rawDateString: rawDate,
        location: e.locatie || e.city || "Sibiu",
        image: e.image || null,
        url: e.link || null
      };
    })
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
        const token = localStorage.getItem("token");

        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['x-access-token'] = token;
        }

        const [resConcursuri, resCalendar] = await Promise.all([
            fetch(`${API_BASE}/api/concursuri`, { headers }).catch(() => null),
            fetch(`${API_BASE}/api/calendar/evenimente`, { headers }).catch(() => null)
        ]);

        // Ținem cele două surse separate ca să putem elimina duplicatele înainte de combinare.
        let dataConcursuri = [];
        let dataCalendar = [];

        if (resConcursuri && resConcursuri.ok) {
            const dataC = await resConcursuri.json();
            dataConcursuri = Array.isArray(dataC) ? dataC : [];
        }

        if (resCalendar && resCalendar.ok) {
            const dataCal = await resCalendar.json();
            dataCalendar = Array.isArray(dataCal) ? dataCal : [];
        }

        // FIX 3: DEDUPLICARE.
        // Când creezi un eveniment de tip "Competitie" în calendar, backend-ul îl scrie
        // și în tabela 'concursuri', și în 'calendar_club' (cu id_concurs_asociat = id-ul concursului).
        // Deci același eveniment vine din ambele endpoint-uri. Strângem id-urile de concurs
        // deja prezente în calendar și le excludem din lista de concursuri.
        const idConcursuriInCalendar = new Set(
            dataCalendar
                .map(e => e.id_concurs_asociat)
                .filter(id => id !== null && id !== undefined)
        );

        const concursuriFaraDuplicate = dataConcursuri.filter(
            c => !idConcursuriInCalendar.has(c.id)
        );

        const combinedData = [...dataCalendar, ...concursuriFaraDuplicate];

        const items = normalizeEvents(combinedData);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const upcoming = items
            .filter(e => e.start.getTime() >= now.getTime() - (24 * 60 * 60 * 1000))
            .sort((a, b) => a.start - b.start);

        if (active) {
            setEvent(upcoming[0] || null);
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
  if (!event) return null;

  return <NextEventCard event={event} />;
}

function NextEventCard({ event }) {
  const { days, hours, minutes, seconds, finished } = useCountdown(event.start);
  const dateDisplay = event.rawDateString || event.start.toLocaleDateString("ro-RO");

  return (
    <div className="next-event-wrapper">
      <div className="next-event-card">
        <div className="live-badge">
            <span className="pulse-dot"></span> {getBadgeText(event.typeLabel)}
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

        <div className="ne-bg-icon">
            <i className="fas fa-trophy"></i>
        </div>
    </div>
    </div>
  );
}