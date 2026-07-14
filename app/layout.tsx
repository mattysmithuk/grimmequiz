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
            {/* Drop the official logo into /public/grimme-logo.svg and swap the
                span below for: <img src="/grimme-logo.svg" alt="GRIMME" /> */}
            <span className="wordmark">GRIMME</span>
            <span className="tag">Harvest Quiz</span>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
