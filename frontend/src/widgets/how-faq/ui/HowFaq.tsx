import { HugeiconsIcon } from '@hugeicons/react';
import {
  BadgeQuestionMarkIcon,
  Wallet02Icon,
  Mortarboard02Icon,
  ShuffleSquareIcon,
  UserArrowLeftRightIcon,
  Time02Icon,
} from '@hugeicons/core-free-icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { cn } from '@/shared/lib/utils';

const faq = [
  {
    value: 'is_free',
    trigger: 'Это бесплатно?',
    content:
      'Да. Роадмапы, прогресс и статистика доступны всем — регистрация нужна только чтобы сохранять, где ты остановился.',
    icon: Wallet02Icon,
  },
  {
    value: 'lessons',
    trigger: 'Здесь есть уроки и видео?',
    content:
      'Нет. devio — карта, а не курс: он говорит, что учить и в каком порядке, и ведёт к проверенным материалам. Учишься ты по ним, а не по нам.',
    icon: Mortarboard02Icon,
  },
  {
    value: 'roadmap',
    trigger: 'Можно ехать не по порядку?',
    content:
      'Можно – станции отмечаются в любом порядке. Но порядок на линии выстроен так, что каждая следующая опирается на предыдущую: прыгать через станции стоит осознанно.',
    icon: ShuffleSquareIcon,
  },
  {
    value: 'newbie',
    trigger: 'А если я не новичок?',
    content:
      'Отметь пройденное — и линия покажет, где у тебя пробелы. Часто оказывается, что «знаю React» соседствует с пропущенной станцией TypeScript.',
    icon: UserArrowLeftRightIcon,
  },
  {
    value: 'time',
    trigger: 'Сколько это займёт?',
    content:
      'Frontend — около четырёх месяцев в спокойном темпе, Backend — около пяти. У каждой станции своя оценка в неделях, из них и складывается срок.',
    icon: Time02Icon,
  },
];

export function HowFaq() {
  return (
    <>
      <section>
        <div className="flex items-center gap-2.25 mb-0.75">
          <HugeiconsIcon
            icon={BadgeQuestionMarkIcon}
            strokeWidth={1.5}
            className="size-3.75 text-mist-soft"
          />
          <h2 className="sec-head">Частые вопросы</h2>
        </div>
        <p className="sec-sub mb-6">коротко и по делу</p>

        <Accordion
          type="single"
          collapsible
          defaultValue={faq[0] ? faq[0].value : 'is_free'}
          className="w-full border border-line rounded-xl"
        >
          {faq.map((item, index) => {
            const Icon = item.icon;
            const isLast = faq.length - 1 === index;
            return (
              <AccordionItem
                key={item.value}
                value={item.value}
                className={cn('py-2.25', !isLast && 'border-b border-b-line')}
              >
                <AccordionTrigger className="inline-flex items-center gap-3 text-mist font-semibold text-[13.5px] duration-300 hover:text-mint hover:no-underline px-10">
                  <div className="inline-flex gap-3">
                    <HugeiconsIcon
                      icon={Icon}
                      strokeWidth={1.5}
                      className="size-4.5 text-signal"
                    />
                    {item.trigger}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-mist-soft mt-2.75 pl-10 text-[14.5px] max-w-[62ch]">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      <div className="rule" />
    </>
  );
}
