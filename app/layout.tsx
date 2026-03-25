
export const metadata = {
  title: "AC Fault DB Wave 5 Smart",
  description: "Smart HVAC fault code database with symptom search and guided diagnostics",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar">
      <body style={{fontFamily:'Arial, sans-serif', margin:0, background:'#f5f7fb', color:'#0f172a'}}>
        {children}
      </body>
    </html>
  );
}
