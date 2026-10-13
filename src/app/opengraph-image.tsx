import { ImageResponse } from "next/og";

export const alt = "CliniquePro — Le logiciel de gestion de votre clinique, centre de santé ou cabinet médical";
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
          Le logiciel de gestion de votre clinique, centre de santé ou cabinet médical
        </div>
        <div style={{ marginTop: 36, fontSize: 28, color: "#a9cdff" }}>
          Toutes spécialités · Gestion opérationnelle · Gestion financière et comptable
        </div>
        <div style={{ marginTop: 14, fontSize: 24, color: "#6f9bd6" }}>Édité à Abidjan par Alliance Consultants</div>
      </div>
    ),
    size,
  );
}
