'use client';

import { useRef, useState } from 'react';

type PublicQuestion = { id: number; text: string; options: string[] };
type MarketingQuestion = { key: string; label: string; options: string[] };

type Props = {
  questions: PublicQuestion[];
  marketing: MarketingQuestion[];
};

type Stage = 'intro' | 'quiz' | 'details' | 'done';

export default function Quiz({ questions, marketing }: Props) {
  const [stage, setStage] = useState<Stage>('intro');
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const startedAt = useRef(0);

  // Details form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [farm, setFarm] = useState('');
  const [postcode, setPostcode] = useState('');
  const [mkt, setMkt] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);

  const q = questions[idx];
  const picked = answers[q?.id];

  function begin() {
    startedAt.current = Date.now();
    setStage('quiz');
  }

  function pick(optionIdx: number) {
    setAnswers((a) => ({ ...a, [q.id]: optionIdx }));
  }

  function next() {
    if (idx < questions.length - 1) setIdx(idx + 1);
    else setStage('details');
  }

  function back() {
    if (idx > 0) setIdx(idx - 1);
  }

  async function submit() {
    setError('');
    if (!name.trim()) return setError('Please enter your name.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError('Please enter a valid email address.');
    for (const m of marketing) {
      if (!mkt[m.key]) return setError(`Please answer: ${m.label}`);
    }
    setBusy(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          farm: farm.trim(),
          postcode: postcode.trim(),
          answers,
          marketing: mkt,
          consent,
          timeSeconds: Math.round((Date.now() - startedAt.current) / 1000),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please ask a member of staff.');
        return;
      }
      setResult({ score: data.score, total: data.total });
      setStage('done');
    } catch {
      setError('Could not reach the server. Please ask a member of staff.');
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setStage('intro');
    setIdx(0);
    setAnswers({});
    setResult(null);
    setName('');
    setEmail('');
    setFarm('');
    setPostcode('');
    setMkt({});
    setConsent(false);
    setError('');
  }

  if (stage === 'intro') {
    return (
      <main className="card center">
        <h1>How well do you know your harvest?</h1>
        <p className="lede">
          Ten quick questions on GRIMME potato harvesting technology. The highest score,
          with the fastest time as the tiebreaker, wins a prize at the end of the Driffield Show.
        </p>
        <button className="btn" onClick={begin}>Start the quiz</button>
      </main>
    );
  }

  if (stage === 'quiz') {
    return (
      <main className="card">
        <div className="ridge" aria-hidden="true">
          {questions.map((qq, i) => (
            <span key={qq.id} className={i <= idx ? 'done' : ''} />
          ))}
        </div>
        <div className="qcount">Question {idx + 1} of {questions.length}</div>
        <p className="qtext">{q.text}</p>
        <div className="options">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`option ${picked === i ? 'picked' : ''}`}
              onClick={() => pick(i)}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="row">
          <button className="btn ghost" onClick={back} disabled={idx === 0}>Back</button>
          <button className="btn" onClick={next} disabled={picked === undefined}>
            {idx === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </main>
    );
  }

  if (stage === 'details') {
    return (
      <main className="card">
        <h2>Nearly there</h2>
        <p className="lede">Leave your details so we can let you know if you have won.</p>

        <label className="field">
          <span className="lab">Your name</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label className="field">
          <span className="lab">Email address</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label className="field">
          <span className="lab">Farm or business name (optional)</span>
          <input type="text" value={farm} onChange={(e) => setFarm(e.target.value)} />
        </label>
        <label className="field">
          <span className="lab">Postcode (optional)</span>
          <input type="text" value={postcode} onChange={(e) => setPostcode(e.target.value)} autoComplete="postal-code" />
        </label>

        {marketing.map((m) => (
          <label className="field" key={m.key}>
            <span className="lab">{m.label}</span>
            <select value={mkt[m.key] ?? ''} onChange={(e) => setMkt((s) => ({ ...s, [m.key]: e.target.value }))}>
              <option value="" disabled>Choose an option</option>
              {m.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}

        <label className="consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>
            I am happy for GRIMME UK to contact me about products, demonstrations and offers.
            Your details are used to run this competition and, only if ticked, for marketing.
          </span>
        </label>

        {error && <p className="error">{error}</p>}

        <div className="row">
          <button className="btn ghost" onClick={() => setStage('quiz')}>Back</button>
          <button className="btn" onClick={submit} disabled={busy}>
            {busy ? 'Submitting…' : 'See my score'}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="card center">
      <h2>Thanks, {name.split(' ')[0]}!</h2>
      <div className="score-big">{result?.score}/{result?.total}</div>
      <p className="lede">
        Your entry is in. The winner will be announced at the GRIMME stand at the end of the Driffield Show. Good luck!
      </p>
      <button className="btn" onClick={reset}>Next visitor</button>
    </main>
  );
}
