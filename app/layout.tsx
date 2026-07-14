import './globals.css';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'GRIMME Harvest Quiz | Driffield Show',
  description: 'Test your GRIMME potato harvesting knowledge at the Driffield Show and win a prize',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <div className="shell">
          <header className="masthead">
            <img className="wordmark" src="/images.png" alt="GRIMME" />

            <span className="tag">Driffield Show</span>
          </header>
          {children}
        </div>
      </body>

    </html>
  );
}
