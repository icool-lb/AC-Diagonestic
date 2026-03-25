
"use client";
import React, { useMemo, useState } from "react";
import { faultsWave5, symptomScenarios } from "../data/faults-wave5";

type Fault = (typeof faultsWave5)[number];
type Scenario = (typeof symptomScenarios)[number];

const categoryLabels: Record<string, { ar: string; en: string }> = {
  communication: { ar: "تواصل داخلي/خارجي", en: "Communication" },
  sensor: { ar: "حساسات وحرارة", en: "Sensors" },
  fan_motor: { ar: "مروحة / موتور", en: "Fan Motor" },
  compressor_drive: { ar: "ضاغط / انفرتر", en: "Compressor / Inverter" },
  refrigerant_pressure: { ar: "غاز / ضغط", en: "Refrigerant / Pressure" },
  drain_water: { ar: "درين / ماء", en: "Drain / Water" },
  power_voltage: { ar: "تغذية / فولتية", en: "Power / Voltage" },
  pcb_memory: { ar: "بورد / EEPROM", en: "PCB / Memory" },
  protection_misc: { ar: "حماية عامة", en: "General Protection" },
};

function normalize(v: string) {
  return v.toLowerCase().trim();
}

export default function Page() {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("All");
  const [unitType, setUnitType] = useState("All");
  const [technology, setTechnology] = useState("All");
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<Fault | null>(faultsWave5[0] as Fault);

  const brands = ["All", ...Array.from(new Set(faultsWave5.map(x => x.brand))).sort()];
  const unitTypes = ["All", ...Array.from(new Set(faultsWave5.map(x => x.unit_type))).sort()];
  const technologies = ["All", ...Array.from(new Set(faultsWave5.map(x => x.technology))).sort()];

  const selectedTargets = useMemo(() => {
    const set = new Set<string>();
    symptomScenarios.forEach(s => {
      if (selectedScenarioIds.includes(s.id)) s.targets.forEach(t => set.add(t));
    });
    return Array.from(set);
  }, [selectedScenarioIds]);

  const rows = useMemo(() => {
    const qq = normalize(q);
    return faultsWave5.filter((r) => {
      const hay = [
        r.code,
        r.title,
        r.brand,
        r.series,
        r.model_family,
        r.unit_type,
        r.technology,
        r.category,
        ...r.symptom_tags_en,
        ...r.symptom_tags_ar,
      ]
        .join(" ")
        .toLowerCase();
      return (
        (brand === "All" || r.brand === brand) &&
        (unitType === "All" || r.unit_type === unitType) &&
        (technology === "All" || r.technology === technology) &&
        (!qq || hay.includes(qq))
      );
    });
  }, [q, brand, unitType, technology]);

  const smartSuggestions = useMemo(() => {
    return rows
      .map((r) => {
        let score = 0;
        if (selectedTargets.includes(r.category)) score += 6;
        if (q && normalize(r.code).includes(normalize(q))) score += 4;
        if (q && normalize(r.title).includes(normalize(q))) score += 3;
        if (q && [...r.symptom_tags_en, ...r.symptom_tags_ar].join(" ").toLowerCase().includes(normalize(q))) score += 2;
        if (r.confidence === "high") score += 2;
        if (r.source_type === "official") score += 1;
        return { r, score };
      })
      .filter(x => selectedTargets.length ? x.score >= 6 : x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [rows, selectedTargets, q]);

  const categoryRanking = useMemo(() => {
    const counts = new Map<string, number>();
    rows.forEach(r => {
      const base = counts.get(r.category) || 0;
      const extra = selectedTargets.includes(r.category) ? 3 : 0;
      counts.set(r.category, base + 1 + extra);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [rows, selectedTargets]);

  return (
    <main style={{ maxWidth: 1500, margin: "0 auto", padding: 20 }}>
      <section style={hero}>
        <div>
          <div style={badge}>Wave 5 Smart</div>
          <h1 style={{ margin: "10px 0 8px", fontSize: 34 }}>قاعدة أعطال المكيفات الذكية</h1>
          <p style={{ margin: 0, color: "#dbe5ff", lineHeight: 1.6, maxWidth: 820 }}>
            مشروع عملي للاستخدام الميداني: بحث بالكود أو العارض، اقتراحات ذكية، وربط كل سجل بالمصدر الأصلي.
            <br />
            Smart field guidance is shown clearly beside the original code meaning.
          </p>
        </div>

        <div style={heroStats}>
          <Stat label="السجلات" value={String(faultsWave5.length)} />
          <Stat label="الماركات" value={String(new Set(faultsWave5.map(x => x.brand)).size)} />
          <Stat label="فئات التشخيص" value={String(new Set(faultsWave5.map(x => x.category)).size)} />
          <Stat label="مصادر عالية الثقة" value={String(faultsWave5.filter(x => x.confidence === "high").length)} />
        </div>
      </section>

      <section style={gridTop}>
        <div style={panel}>
          <h2 style={sectionTitle}>البحث السريع</h2>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 10 }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث بالكود أو العطل أو السلسلة... مثال: U4 أو لا يبرد"
              style={input}
            />
            <select value={brand} onChange={(e) => setBrand(e.target.value)} style={input}>
              {brands.map(v => <option key={v}>{v}</option>)}
            </select>
            <select value={unitType} onChange={(e) => setUnitType(e.target.value)} style={input}>
              {unitTypes.map(v => <option key={v}>{v}</option>)}
            </select>
            <select value={technology} onChange={(e) => setTechnology(e.target.value)} style={input}>
              {technologies.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Search by symptom / البحث بالعارض</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {symptomScenarios.map((s) => {
                const active = selectedScenarioIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() =>
                      setSelectedScenarioIds(active ? selectedScenarioIds.filter(x => x !== s.id) : [...selectedScenarioIds, s.id])
                    }
                    style={{
                      ...chip,
                      background: active ? "#1d4ed8" : "white",
                      color: active ? "white" : "#0f172a",
                      borderColor: active ? "#1d4ed8" : "#cbd5e1",
                    }}
                  >
                    {s.label_ar}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={panel}>
          <h2 style={sectionTitle}>المساعد الذكي</h2>
          <div style={{ color: "#475569", lineHeight: 1.7 }}>
            {selectedScenarioIds.length === 0 ? (
              <>
                اختر عرضًا واحدًا أو أكثر ليظهر لك ترتيب احتمالات الأعطال.
                <br />
                مثال: <b>الوحدة لا تبرد + المروحة تعمل</b> → غالبًا غاز/ضغط أو ضاغط/انفرتر.
              </>
            ) : (
              <>
                تم اختيار <b>{selectedScenarioIds.length}</b> عوارض. تم رفع أولوية السجلات المطابقة لهذه الفئات.
              </>
            )}
          </div>

          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {categoryRanking.map(([key, value]) => (
              <div key={key} style={{ display: "grid", gridTemplateColumns: "220px 1fr 54px", gap: 8, alignItems: "center" }}>
                <div style={{ fontWeight: 700 }}>{categoryLabels[key]?.ar || key}</div>
                <div style={{ background: "#e2e8f0", borderRadius: 999, overflow: "hidden", height: 10 }}>
                  <div style={{ width: `${Math.min(100, value * 7)}%`, background: "#2563eb", height: "100%" }} />
                </div>
                <div style={{ textAlign: "right", color: "#475569" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.2fr 1.4fr 1.4fr", gap: 14 }}>
        <div style={panel}>
          <h2 style={sectionTitle}>اقتراحات ذكية</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {smartSuggestions.length === 0 && (
              <div style={{ color: "#64748b" }}>لا توجد اقتراحات بعد. اختر عارضًا أو اكتب كودًا.</div>
            )}
            {smartSuggestions.map(({ r, score }) => (
              <button key={r.id} onClick={() => setSelected(r as Fault)} style={suggestionBtn}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "start" }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>{r.code} — {r.title}</div>
                    <div style={{ color: "#475569", marginTop: 4 }}>{r.brand} • {r.unit_type}</div>
                    <div style={{ color: "#1d4ed8", marginTop: 6 }}>{categoryLabels[r.category]?.ar}</div>
                  </div>
                  <div style={scorePill}>{score}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={panel}>
          <h2 style={sectionTitle}>نتائج قاعدة البيانات</h2>
          <div style={{ maxHeight: 760, overflow: "auto", display: "grid", gap: 8 }}>
            {rows.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r as Fault)}
                style={{
                  ...rowBtn,
                  borderColor: selected?.id === r.id ? "#2563eb" : "#e2e8f0",
                  boxShadow: selected?.id === r.id ? "0 0 0 3px rgba(37,99,235,.12)" : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 800 }}>{r.code} — {r.title}</div>
                    <div style={{ color: "#475569", marginTop: 3 }}>{r.brand} • {r.series}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                      <Pill>{r.unit_type}</Pill>
                      <Pill>{r.technology}</Pill>
                      <Pill>{categoryLabels[r.category]?.ar}</Pill>
                    </div>
                  </div>
                  <div style={{
                    ...confidencePill,
                    background: r.confidence === "high" ? "#dcfce7" : "#fef3c7",
                    color: r.confidence === "high" ? "#166534" : "#92400e"
                  }}>
                    {r.confidence}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={panel}>
          {selected ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
                <div>
                  <div style={{ color: "#475569", fontSize: 13 }}>{selected.brand} • {selected.unit_type} • {selected.technology}</div>
                  <h2 style={{ margin: "6px 0 4px" }}>{selected.code} — {selected.title}</h2>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Pill>{selected.series}</Pill>
                    <Pill>{selected.model_family}</Pill>
                    <Pill>{categoryLabels[selected.category]?.ar}</Pill>
                  </div>
                </div>
                <img
                  src={`/illustrations/${selected.image_key}.svg`}
                  alt={selected.category}
                  style={{ width: 110, height: 110, borderRadius: 16, border: "1px solid #e2e8f0", background: "#f8fafc" }}
                />
              </div>

              <div style={detailBlock}>
                <Label>المعنى المؤكد من المصدر</Label>
                <div>{selected.title}</div>
              </div>

              <div style={detailBlock}>
                <Label>AI Suggestion / التوجيه الذكي</Label>
                <div style={{ lineHeight: 1.7 }}>{selected.ai_hint_ar}</div>
              </div>

              <div style={detailGrid}>
                <DetailList title="Likely causes / الأسباب المحتملة" items={selected.likely_causes as unknown as string[]} />
                <DetailList title="Check steps / خطوات الفحص" items={selected.check_steps as unknown as string[]} ordered />
              </div>

              <div style={detailBlock}>
                <Label>Suspected parts / القطع المحتملة</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(selected.parts_suspects as unknown as string[]).map((p) => <Pill key={p}>{p}</Pill>)}
                </div>
              </div>

              <div style={detailBlock}>
                <Label>Useful symptom tags / وسوم العوارض</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(selected.symptom_tags_ar as unknown as string[]).map((t) => <Pill key={t}>{t}</Pill>)}
                </div>
              </div>

              <div style={sourceBox}>
                <div><b>Source key:</b> {selected.source_key}</div>
                <div><b>Source type:</b> {selected.source_type}</div>
                <div><b>Confidence:</b> {selected.confidence}</div>
                <div style={{ marginTop: 8 }}>
                  <a href={selected.source_url} target="_blank" rel="noreferrer" style={{ color: "#1d4ed8", fontWeight: 700 }}>
                    Open source manual / page
                  </a>
                </div>
              </div>

              <div style={{ marginTop: 12, color: "#64748b", lineHeight: 1.6, fontSize: 13 }}>
                <b>Important:</b> {selected.field_guidance_basis}
              </div>
            </>
          ) : (
            <div>اختر سجلًا لعرض التفاصيل.</div>
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={statCard}>
      <div style={{ color: "#dbe5ff", fontSize: 13 }}>{label}</div>
      <div style={{ fontWeight: 900, fontSize: 28, marginTop: 6 }}>{value}</div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span style={pill}>{children}</span>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 13, color: "#475569", fontWeight: 700, marginBottom: 6 }}>{children}</div>;
}

function DetailList({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <div style={{ ...detailBlock, marginTop: 0 }}>
      <Label>{title}</Label>
      <Tag style={{ margin: 0, paddingInlineStart: 18, lineHeight: 1.8 }}>
        {items.map((x) => <li key={x}>{x}</li>)}
      </Tag>
    </div>
  );
}

const hero: React.CSSProperties = {
  background: "linear-gradient(135deg, #0f172a, #1d4ed8)",
  color: "white",
  padding: 22,
  borderRadius: 24,
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr",
  gap: 20,
  marginBottom: 16,
};

const badge: React.CSSProperties = {
  display: "inline-block",
  background: "rgba(255,255,255,.14)",
  border: "1px solid rgba(255,255,255,.18)",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
};

const heroStats: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

const statCard: React.CSSProperties = {
  background: "rgba(255,255,255,.08)",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 18,
  padding: 14,
};

const panel: React.CSSProperties = {
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: 22,
  padding: 16,
  boxShadow: "0 10px 25px rgba(15,23,42,.04)",
};

const sectionTitle: React.CSSProperties = { margin: "0 0 14px", fontSize: 20 };

const gridTop: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.6fr 1fr",
  gap: 14,
  marginBottom: 14,
};

const input: React.CSSProperties = {
  padding: "12px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  fontSize: 14,
  width: "100%",
  background: "white",
};

const chip: React.CSSProperties = {
  padding: "10px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: 999,
  cursor: "pointer",
  fontWeight: 700,
};

const suggestionBtn: React.CSSProperties = {
  border: "1px solid #dbeafe",
  background: "#eff6ff",
  borderRadius: 18,
  padding: 12,
  cursor: "pointer",
  textAlign: "left",
};

const scorePill: React.CSSProperties = {
  background: "#1d4ed8",
  color: "white",
  borderRadius: 999,
  minWidth: 36,
  height: 36,
  display: "grid",
  placeItems: "center",
  fontWeight: 800,
};

const rowBtn: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  background: "white",
  borderRadius: 18,
  padding: 12,
  cursor: "pointer",
  textAlign: "left",
};

const confidencePill: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
  whiteSpace: "nowrap",
  height: "fit-content",
};

const pill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "6px 10px",
  background: "#f1f5f9",
  border: "1px solid #e2e8f0",
  borderRadius: 999,
  fontSize: 12,
};

const detailBlock: React.CSSProperties = {
  marginTop: 14,
  padding: 14,
  borderRadius: 16,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const detailGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginTop: 14,
};

const sourceBox: React.CSSProperties = {
  marginTop: 14,
  borderRadius: 16,
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  padding: 14,
  lineHeight: 1.7,
};
