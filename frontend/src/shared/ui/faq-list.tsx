'use client';

import type { Faq } from '@/entities/faq';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface FaqListProps {
  questions: Faq[];
  className?: string;
}

export function FaqList({
  questions,
  className,
}: FaqListProps) {
  const defaultValue: string = questions[0]?.value as string ?? "";
  const [activeValue, setActiveValue] = useState<string>(defaultValue);

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultValue}
      className={className}
      onValueChange={setActiveValue}
    >
      {questions.map((question) => {
        const isActive: boolean = question.value === activeValue;

        return (
          <AccordionItem
            key={question.value}
            value={question.value}
            className={cn("rounded-(--r-md) bg-surface border border-line-2", isActive && "bg-surface-2")}
          >
            <AccordionTrigger className="flex items-center justify-between gap-5 py-5.5 px-6.5 hover:no-underline">
              {question.title}
            </AccordionTrigger>
            <AccordionContent className="px-6.5 pb-6 text-muted max-w-[62ch]">
              {question.description}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
