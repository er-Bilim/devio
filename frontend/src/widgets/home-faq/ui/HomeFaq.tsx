import { FaqList } from '@/shared/ui/faq-list';
import { questions } from '../model/questions';

export function HomeFaq() {
  return (
    <section className="wrap">
      <div className="head center">
        <span className="kicker">Вопросы</span>
        <h2>Перед тем как начать</h2>
      </div>
      <FaqList
        questions={questions}
        className="max-w-190 mx-auto flex flex-col gap-3"
      />
    </section>
  );
}
