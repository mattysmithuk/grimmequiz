import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GRIMME Harvest Quiz',
  description: 'Test your GRIMME potato harvesting knowledge and win a prize',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <div className="shell">
          <header className="masthead">
            <img className="wordmark" src="/grimme-logo.svg" alt="GRIMME" />
            <span className="tag">Harvest Quiz</span>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
