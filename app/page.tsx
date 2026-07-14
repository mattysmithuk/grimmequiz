import Quiz from '@/components/Quiz';
import { PUBLIC_QUESTIONS, MARKETING_QUESTIONS } from '@/lib/questions';

export default function Home() {
  return (
    <Quiz
      questions={PUBLIC_QUESTIONS}
      marketing={MARKETING_QUESTIONS.map((m) => ({ ...m, options: [...m.options] }))}
    />
  );
}
