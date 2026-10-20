"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, Check, HelpCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import { AdminButton, PageHeader } from "@/components/admin/page-header";
import { FormError, TextAreaField, TextField } from "@/components/forms/fields";
import {
  useCreateFaq,
  useDeleteFaq,
  useFaqs,
  useReorderFaqs,
  useUpdateFaq,
} from "@/hooks/use-faqs";
import type { FaqItem } from "@/lib/types";

function FaqEditor({
  idPrefix,
  initial,
  pending,
  error,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  idPrefix: string;
  initial: Pick<FaqItem, "question" | "answer">;
  pending: boolean;
  error?: string | null;
  submitLabel: string;
  onSubmit: (value: Pick<FaqItem, "question" | "answer">) => void;
  onCancel?: () => void;
}) {
  const [question, setQuestion] = useState(initial.question);
  const [answer, setAnswer] = useState(initial.answer);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ question, answer });
      }}
      className="space-y-4"
    >
      <TextField id={`${idPrefix}-q`} label="Question" value={question} onChange={setQuestion} required maxLength={240} />
      <TextAreaField id={`${idPrefix}-a`} label="Answer" value={answer} onChange={setAnswer} required rows={4} />
      <FormError message={error} />
      <div className="flex flex-wrap gap-3">
        <AdminButton type="submit" disabled={pending}>
          <Check className="size-4" /> {pending ? "Saving…" : submitLabel}
        </AdminButton>
        {onCancel && (
          <AdminButton variant="outline" onClick={onCancel}>
            <X className="size-4" /> Cancel
          </AdminButton>
        )}
      </div>
    </form>
  );
}

export default function FaqsPage() {
  const { data: faqs = [], isPlaceholderData } = useFaqs();
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();
  const reorder = useReorderFaqs();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  function move(index: number, delta: number) {
    const ids = faqs.map((f) => f.id);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    reorder.mutate(ids);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="FAQs"
        description="Questions shown on the Contact page. Changes go live immediately."
        actions={
          !adding && (
            <AdminButton onClick={() => setAdding(true)}>
              <Plus className="size-4" /> Add question
            </AdminButton>
          )
        }
      />

      <AnimatePresence>
        {adding && (
          <motion.section
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-3xl border border-primary/15 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-semibold text-primary">New question</h2>
            <FaqEditor
              idPrefix="new-faq"
              initial={{ question: "", answer: "" }}
              pending={createFaq.isPending}
              error={createFaq.isError ? createFaq.error.message : null}
              submitLabel="Add question"
              onSubmit={(value) => createFaq.mutate(value, { onSuccess: () => setAdding(false) })}
              onCancel={() => setAdding(false)}
            />
          </motion.section>
        )}
      </AnimatePresence>

      {faqs.length === 0 && !isPlaceholderData ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-primary/20 bg-white/60 py-20 text-center text-primary/50">
          <HelpCircle className="size-8" />
          <p>No FAQs yet. The FAQ section is hidden on the site until you add one.</p>
        </div>
      ) : (
        <ol className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.li
              layout
              key={faq.id}
              className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm"
            >
              {editingId === faq.id ? (
                <FaqEditor
                  idPrefix={faq.id}
                  initial={faq}
                  pending={updateFaq.isPending}
                  error={updateFaq.isError ? updateFaq.error.message : null}
                  submitLabel="Save changes"
                  onSubmit={(value) =>
                    updateFaq.mutate({ id: faq.id, ...value }, { onSuccess: () => setEditingId(null) })
                  }
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-display text-primary">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-semibold text-primary">{faq.question}</p>
                    <p className="mt-2 whitespace-pre-wrap text-primary/70">{faq.answer}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Move up"
                      className="flex size-11 items-center justify-center rounded-full border border-primary/15 text-primary hover:bg-muted disabled:opacity-30"
                    >
                      <ArrowUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === faqs.length - 1}
                      aria-label="Move down"
                      className="flex size-11 items-center justify-center rounded-full border border-primary/15 text-primary hover:bg-muted disabled:opacity-30"
                    >
                      <ArrowDown className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(faq.id)}
                      aria-label="Edit"
                      className="flex size-11 items-center justify-center rounded-full border border-primary/15 text-primary hover:bg-muted"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Delete this question?")) deleteFaq.mutate(faq.id);
                      }}
                      aria-label="Delete"
                      className="flex size-11 items-center justify-center rounded-full border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.li>
          ))}
        </ol>
      )}
    </div>
  );
}
