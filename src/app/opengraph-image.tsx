import { ImageResponse } from "next/og";

export const alt = "CliniquePro — Logiciel de gestion pour cliniques ophtalmologiques";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #040f26 0%, #0c2a5c 60%, #0a5a4a 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800 }}>
          <span>Clinique</span>
          <span style={{ color: "#3ddc84" }}>Pro</span>
        </div>
        <div style={{ marginTop: 32, fontSize: 56, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
          La plateforme tout-en-un pour piloter votre clinique ophtalmologique
        </div>
        <div style={{ marginTop: 36, fontSize: 28, color: "#a9cdff" }}>
          Gestion opérationnelle · Gestion financière et comptable
        </div>
      </div>
    ),
    size,
  );
}
