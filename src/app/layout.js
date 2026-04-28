import './globals.css';

export const metadata = {
  title: 'Student Performance Tracker | DBMS Mini Project',
  description: 'Track student semester performance, visualize marks with beautiful charts, and predict future scores using the Law of Averages.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
