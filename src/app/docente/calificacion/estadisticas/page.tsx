"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import axios from "axios";
import Link from "next/link";
import { API_BASE_URL } from "../../../../../config";

/* ─── Types ─────────────────────────────────────────────────── */
interface CalificacionRow {
  id_inscripcion: number;
  grupo_nombre: string;
  nombre: string;
  apellido: string;
  numero_documento: string;
  seguimiento_1: number | null;
  seguimiento_2: number | null;
  nota_conceptual_docente: number | null;
  nota_conceptual_estudiante: number | null;
  nota_final: number | null;
  observaciones: string;
}

/* ─── Helpers ────────────────────────────────────────────────── */
const toNum = (v: any): number | null => {
  if (v === null || v === undefined || v === "") return null;
  const p = parseFloat(v);
  return isNaN(p) ? null : p;
};

const COLORS = {
  aprobado: "#22c55e",
  reprobado: "#ef4444",
  sinNota: "#94a3b8",
  seg1: "#3b82f6",
  seg2: "#8b5cf6",
  docente: "#f59e0b",
  estudiante: "#ec4899",
  final: "#14b8a6",
};

const ROJO = "#c40e1a";
const ROJO_DARK = "#a00e1a";

/* ─── Stat Card ──────────────────────────────────────────────── */
function StatCard({
  icon,
  label,
  value,
  sub,
  color = ROJO,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        flex: 1,
        minWidth: 160,
        background: "linear-gradient(135deg, #fff 60%, #fef2f2 100%)",
        borderTop: `4px solid ${color}`,
        transition: "transform .2s, box-shadow .2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 32px rgba(0,0,0,0.14)" },
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color }}>
          {icon}
          <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={1}>
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight={800} color={color}>
          {value}
        </Typography>
        {sub && (
          <Typography variant="caption" color="text.secondary">
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function EstadisticasCalificacion() {
  const [rows, setRows] = useState<CalificacionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGrupo, setSelectedGrupo] = useState<string>("todos");

  /* ── Fetch ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userString = localStorage.getItem("user");
        if (!userString) { setError("Sin sesión activa."); setLoading(false); return; }
        const token = JSON.parse(userString).token;

        let rawData: any[] = [];

        try {
          const res = await axios.get(
            `${API_BASE_URL}/seguimiento_academico/seg/estudiantes-seguimiento/`,
            { headers: { Authorization: `Token ${token}` } }
          );
          if (Array.isArray(res.data)) rawData = res.data;
          else if (Array.isArray(res.data.results)) rawData = res.data.results;
          else rawData = (Object.values(res.data).find(v => Array.isArray(v)) as any[]) || [];
        } catch (err: any) {
          if (err.response?.status !== 404) throw err;
          // fallback
          const res2 = await axios.get(`${API_BASE_URL}/profesor/prof/mi-grupo/`, {
            headers: { Authorization: `Token ${token}` },
          });
          res2.data.forEach((grupo: any) =>
            grupo.estudiantes.forEach((e: any) =>
              rawData.push({ ...e, grupo_nombre: grupo.nombre, seguimiento_1: null, seguimiento_2: null, nota_conceptual_docente: null, nota_conceptual_estudiante: null, nota_final: null })
            )
          );
        }

        const formatted: CalificacionRow[] = rawData.map((item: any) => {
          const n = item.notas || {};
          return {
            id_inscripcion: item.id_inscripcion,
            grupo_nombre: item.grupo_nombre || item.grupo || "Sin grupo",
            nombre: item.nombre || item.estudiante?.nombre || "",
            apellido: item.apellido || item.estudiante?.apellido || "",
            numero_documento: item.numero_documento || item.estudiante?.numero_documento || "",
            seguimiento_1: toNum(item.seguimiento_1 ?? n.seguimiento_1),
            seguimiento_2: toNum(item.seguimiento_2 ?? n.seguimiento_2),
            nota_conceptual_docente: toNum(item.nota_conceptual_docente ?? n.nota_conceptual_docente),
            nota_conceptual_estudiante: toNum(item.nota_conceptual_estudiante ?? n.nota_conceptual_estudiante),
            nota_final: toNum(item.nota_final ?? n.nota_final),
            observaciones: item.observaciones ?? n.observaciones ?? "",
          };
        });

        setRows(formatted);
      } catch (e: any) {
        setError(e.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ── Filtered dataset ── */
  const grupos = useMemo(() => Array.from(new Set(rows.map(r => r.grupo_nombre))), [rows]);

  const filtered = useMemo(
    () => (selectedGrupo === "todos" ? rows : rows.filter(r => r.grupo_nombre === selectedGrupo)),
    [rows, selectedGrupo]
  );

  /* ── Stats ── */
  const withFinal = useMemo(() => filtered.filter(r => r.nota_final !== null), [filtered]);
  const aprobados = useMemo(() => withFinal.filter(r => r.nota_final! >= 3), [withFinal]);
  const reprobados = useMemo(() => withFinal.filter(r => r.nota_final! < 3), [withFinal]);
  const sinNota = useMemo(() => filtered.filter(r => r.nota_final === null), [filtered]);

  const avg = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

  const promedios = useMemo(() => {
    const get = (field: keyof CalificacionRow) =>
      filtered.map(r => r[field] as number | null).filter(v => v !== null) as number[];
    return {
      seg1: avg(get("seguimiento_1")),
      seg2: avg(get("seguimiento_2")),
      docente: avg(get("nota_conceptual_docente")),
      estudiante: avg(get("nota_conceptual_estudiante")),
      final: avg(get("nota_final")),
    };
  }, [filtered]);

  /* ── Chart data ── */
  const pieData = [
    { name: "Aprobados", value: aprobados.length, color: COLORS.aprobado },
    { name: "Reprobados", value: reprobados.length, color: COLORS.reprobado },
    { name: "Sin nota", value: sinNota.length, color: COLORS.sinNota },
  ].filter(d => d.value > 0);

  const promedioBarData = [
    { label: "Seg. 1", value: promedios.seg1, fill: COLORS.seg1 },
    { label: "Seg. 2", value: promedios.seg2, fill: COLORS.seg2 },
    { label: "Conc. Docente", value: promedios.docente, fill: COLORS.docente },
    { label: "Conc. Estud.", value: promedios.estudiante, fill: COLORS.estudiante },
    { label: "Final", value: promedios.final, fill: COLORS.final },
  ].map(d => ({ ...d, value: d.value !== null ? parseFloat(d.value!.toFixed(2)) : 0 }));

  // Histogram: distribute nota_final into buckets [0-1), [1-2), [2-3), [3-4), [4-5]
  const histData = useMemo(() => {
    const buckets = [
      { rango: "0 – 1", min: 0, max: 1, count: 0 },
      { rango: "1 – 2", min: 1, max: 2, count: 0 },
      { rango: "2 – 3", min: 2, max: 3, count: 0 },
      { rango: "3 – 4", min: 3, max: 4, count: 0 },
      { rango: "4 – 5", min: 4, max: 5.01, count: 0 },
    ];
    withFinal.forEach(r => {
      const b = buckets.find(b => r.nota_final! >= b.min && r.nota_final! < b.max);
      if (b) b.count++;
    });
    return buckets;
  }, [withFinal]);

  // Radar per group
  const radarData = useMemo(() => {
    return grupos.map(g => {
      const gRows = filtered.filter(r => r.grupo_nombre === g);
      const gAvg = (field: keyof CalificacionRow) => {
        const vals = gRows.map(r => r[field] as number | null).filter(v => v !== null) as number[];
        return vals.length ? parseFloat(avg(vals)!.toFixed(2)) : 0;
      };
      return {
        grupo: g.length > 12 ? g.slice(0, 12) + "…" : g,
        "Seg. 1": gAvg("seguimiento_1"),
        "Seg. 2": gAvg("seguimiento_2"),
        "Conc. Doc.": gAvg("nota_conceptual_docente"),
        "Conc. Est.": gAvg("nota_conceptual_estudiante"),
        "Final": gAvg("nota_final"),
      };
    });
  }, [grupos, filtered]);

  // Por grupo bar
  const byGroupData = useMemo(() => {
    return grupos.map(g => {
      const gRows = rows.filter(r => r.grupo_nombre === g);
      const conFinal = gRows.filter(r => r.nota_final !== null);
      const aprobG = conFinal.filter(r => r.nota_final! >= 3).length;
      const reproG = conFinal.filter(r => r.nota_final! < 3).length;
      const sinG = gRows.length - conFinal.length;
      const promFin = avg(conFinal.map(r => r.nota_final!));
      return {
        grupo: g.length > 14 ? g.slice(0, 14) + "…" : g,
        Aprobados: aprobG,
        Reprobados: reproG,
        "Sin Nota": sinG,
        promedio: promFin !== null ? parseFloat(promFin.toFixed(2)) : null,
      };
    });
  }, [grupos, rows]);

  /* ── Render ── */
  if (loading) {
    return (
      <Box sx={{ display: "flex", height: "80vh", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
        <CircularProgress sx={{ color: ROJO }} />
        <Typography color="text.secondary">Cargando estadísticas…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button component={Link} href="/docente/calificacion" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: "flex", flexDirection: "column", gap: 4 }}>

      {/* ── Header ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Button
          component={Link}
          href="/docente/calificacion"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          sx={{ borderColor: ROJO, color: ROJO, borderRadius: 3, "&:hover": { backgroundColor: "#fef2f2" } }}
        >
          Volver
        </Button>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={800} color={ROJO}>
            Analítica de Calificaciones
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Resumen del desempeño académico de tus grupos
          </Typography>
        </Box>

        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Filtrar por grupo</InputLabel>
          <Select
            value={selectedGrupo}
            label="Filtrar por grupo"
            onChange={e => setSelectedGrupo(e.target.value)}
            sx={{ borderRadius: 3 }}
          >
            <MenuItem value="todos">Todos los grupos</MenuItem>
            {grupos.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {/* ── KPI Cards ── */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <StatCard
          icon={<GroupIcon fontSize="small" />}
          label="Total estudiantes"
          value={filtered.length}
          sub={`${withFinal.length} con nota final`}
        />
        <StatCard
          icon={<EmojiEventsIcon fontSize="small" />}
          label="Aprobados"
          value={aprobados.length}
          sub={withFinal.length > 0 ? `${((aprobados.length / withFinal.length) * 100).toFixed(0)}% de calificados` : "–"}
          color={COLORS.aprobado}
        />
        <StatCard
          icon={<WarningAmberIcon fontSize="small" />}
          label="Reprobados"
          value={reprobados.length}
          sub={withFinal.length > 0 ? `${((reprobados.length / withFinal.length) * 100).toFixed(0)}% de calificados` : "–"}
          color={COLORS.reprobado}
        />
        <StatCard
          icon={<TrendingUpIcon fontSize="small" />}
          label="Promedio final"
          value={promedios.final !== null ? promedios.final.toFixed(2) : "–"}
          sub="Escala 0 – 5"
          color={ROJO}
        />
        <StatCard
          icon={<SchoolIcon fontSize="small" />}
          label="Sin calificar"
          value={sinNota.length}
          sub={`${filtered.length > 0 ? ((sinNota.length / filtered.length) * 100).toFixed(0) : 0}% del total`}
          color="#64748b"
        />
      </Box>

      {/* ── Row: Pie + Promedios Bar ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>

        {/* Pie */}
        <Card sx={{ borderRadius: 4, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Estado de Calificación
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Distribución: aprobados, reprobados y sin nota
            </Typography>
            {pieData.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography color="text.secondary">Sin datos suficientes</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val} estudiantes`]} />
                </PieChart>
              </ResponsiveContainer>
            )}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {pieData.map(d => (
                <Chip
                  key={d.name}
                  label={`${d.name}: ${d.value}`}
                  size="small"
                  sx={{ backgroundColor: d.color + "22", color: d.color, fontWeight: 700, border: `1px solid ${d.color}44` }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Promedios por componente */}
        <Card sx={{ borderRadius: 4, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Promedio por Componente
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Media de cada tipo de nota en el grupo seleccionado
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={promedioBarData} margin={{ top: 16, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val: number) => [val.toFixed(2), "Promedio"]} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={52}>
                  {promedioBarData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* ── Histogram ── */}
      <Card sx={{ borderRadius: 4, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Distribución de Notas Finales
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Histograma de frecuencias agrupadas por rango
          </Typography>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={histData} margin={{ top: 16, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="rango" tick={{ fontSize: 13 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(val) => [`${val} estudiantes`]} />
              <Bar dataKey="count" name="Estudiantes" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {histData.map((entry, i) => (
                  <Cell key={i} fill={entry.min >= 3 ? COLORS.aprobado : entry.min >= 2 ? "#facc15" : COLORS.reprobado} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── By Group ── */}
      {grupos.length > 1 && (
        <Card sx={{ borderRadius: 4, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Comparativa por Grupo
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Aprobados, reprobados y sin nota por cada grupo
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byGroupData} margin={{ top: 16, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="grupo" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Aprobados" fill={COLORS.aprobado} radius={[4, 4, 0, 0]} maxBarSize={36} />
                <Bar dataKey="Reprobados" fill={COLORS.reprobado} radius={[4, 4, 0, 0]} maxBarSize={36} />
                <Bar dataKey="Sin Nota" fill={COLORS.sinNota} radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* ── Radar ── */}
      {grupos.length > 0 && selectedGrupo === "todos" && (
        <Card sx={{ borderRadius: 4, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Radar de Desempeño por Grupo
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Promedio de cada componente por grupo en una vista radial
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={[
                { subject: "Seg. 1", ...Object.fromEntries(radarData.map(g => [g.grupo, g["Seg. 1"]])) },
                { subject: "Seg. 2", ...Object.fromEntries(radarData.map(g => [g.grupo, g["Seg. 2"]])) },
                { subject: "Conc. Doc.", ...Object.fromEntries(radarData.map(g => [g.grupo, g["Conc. Doc."]])) },
                { subject: "Conc. Est.", ...Object.fromEntries(radarData.map(g => [g.grupo, g["Conc. Est."]])) },
                { subject: "Final", ...Object.fromEntries(radarData.map(g => [g.grupo, g["Final"]])) },
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fontSize: 11 }} />
                {radarData.map((g, i) => {
                  const radarColors = [ROJO, "#3b82f6", "#8b5cf6", "#f59e0b", "#14b8a6", "#ec4899"];
                  return (
                    <Radar
                      key={g.grupo}
                      name={g.grupo}
                      dataKey={g.grupo}
                      stroke={radarColors[i % radarColors.length]}
                      fill={radarColors[i % radarColors.length]}
                      fillOpacity={0.12}
                    />
                  );
                })}
                <Legend />
                <Tooltip formatter={(val: number) => val.toFixed(2)} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* ── Table: Top students ── */}
      <Card sx={{ borderRadius: 4, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Estudiantes Destacados
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Top 5 con mayor nota final
          </Typography>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            {withFinal
              .sort((a, b) => b.nota_final! - a.nota_final!)
              .slice(0, 5)
              .map((r, i) => (
                <Box
                  key={r.id_inscripcion}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    borderRadius: 3,
                    backgroundColor: i === 0 ? "#fef9c3" : i === 1 ? "#f1f5f9" : "#fff",
                    border: "1px solid #e2e8f0",
                    transition: "box-shadow .2s",
                    "&:hover": { boxShadow: "0 2px 12px rgba(0,0,0,0.08)" },
                  }}
                >
                  <Typography
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 14,
                      backgroundColor: i === 0 ? "#facc15" : i === 1 ? "#94a3b8" : "#d97706",
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700} fontSize={14}>
                      {r.nombre} {r.apellido}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {r.grupo_nombre} · Doc: {r.numero_documento}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 3,
                      backgroundColor: r.nota_final! >= 3 ? "#dcfce7" : "#fee2e2",
                      color: r.nota_final! >= 3 ? "#166534" : "#991b1b",
                      fontWeight: 800,
                      fontSize: 16,
                    }}
                  >
                    {r.nota_final!.toFixed(1)}
                  </Box>
                </Box>
              ))}
            {withFinal.length === 0 && (
              <Typography color="text.secondary" textAlign="center" py={3}>
                Aún no hay estudiantes con nota final.
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

    </Box>
  );
}
