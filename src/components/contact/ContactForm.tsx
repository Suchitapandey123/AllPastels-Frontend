"use client";

import { useState, type FormEvent } from "react";
import { CheckIcon } from "@/components/ui/icons";

/**
 * ContactForm — client-validated enquiry form.
 *
 * Validates on submit and reports errors through `aria-describedby` plus
 * `role="alert"`, so failures are announced rather than only shown. Wiring
 * this to a real inbox means replacing `handleSubmit`.
 */

interface FormValues {
  name: string;
  email: string;
  orderNumber: string;
  topic: string;
  message: string;
}

const EMPTY: FormValues = {
  name: "",
  email: "",
  orderNumber: "",
  topic: "Sizing & fit",
  message: "",
};

const TOPICS = [
  "Sizing & fit",
  "An existing order",
  "Returns & exchanges",
  "Gifting",
  "Wholesale & partnerships",
  "Something else",
];

function validate(values: FormValues): Partial<Record<keyof FormValues, string>> {
  const errors: Partial<Record<keyof FormValues, string>> = {};

  if (!values.name.trim()) errors.name = "Please tell us your name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
    errors.email = "Please enter a valid email address";
  }
  if (values.message.trim().length < 10) {
    errors.message = "Please add a little more detail so we can help";
  }

  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [sent, setSent] = useState(false);

  const update = (name: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // A real integration would post to a support inbox or form endpoint.
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-6 bg-ash-400 p-8 sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-floral-400 text-ash-800">
          <CheckIcon className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-2xl text-ash-800">Message received</h2>
          <p className="ap-body mt-3 max-w-md text-ash-800/75">
            Thank you, {values.name.split(" ")[0]}. We have your note about
            &ldquo;{values.topic.toLowerCase()}&rdquo; and will reply to{" "}
            {values.email} within one working day.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setValues(EMPTY);
          }}
          className="ap-eyebrow border border-ash-800/30 px-6 py-3 text-ash-800 transition-colors hover:border-ash-800"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-xl">Send us a message</h2>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <TextField
          id="contact-name"
          label="Your name"
          value={values.name}
          error={errors.name}
          onChange={(value) => update("name", value)}
          autoComplete="name"
        />
        <TextField
          id="contact-email"
          label="Email"
          type="email"
          value={values.email}
          error={errors.email}
          onChange={(value) => update("email", value)}
          autoComplete="email"
        />
        <TextField
          id="contact-order"
          label="Order number (optional)"
          value={values.orderNumber}
          onChange={(value) => update("orderNumber", value)}
        />

        <div>
          <label htmlFor="contact-topic" className="ap-eyebrow mb-2 block text-ink/50">
            What is this about?
          </label>
          <select
            id="contact-topic"
            value={values.topic}
            onChange={(event) => update("topic", event.target.value)}
            className="w-full cursor-pointer border-b border-line bg-transparent py-3 text-sm text-ink outline-none transition-colors focus:border-burnt"
          >
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-message" className="ap-eyebrow mb-2 block text-ink/50">
          Your message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={
            errors.message
              ? "w-full border border-burnt bg-transparent p-4 text-sm text-ink outline-none transition-colors"
              : "w-full border border-line bg-transparent p-4 text-sm text-ink outline-none transition-colors focus:border-burnt"
          }
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="ap-body mt-1.5 text-xs text-burnt">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="ap-eyebrow mt-7 w-full bg-ash-800 py-4 text-floral-50 transition-colors duration-500 hover:bg-burnt sm:w-auto sm:px-10"
      >
        Send message
      </button>
    </form>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="ap-eyebrow mb-2 block text-ink/50">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={
          error
            ? "w-full border-b border-burnt bg-transparent py-3 text-sm text-ink outline-none transition-colors"
            : "w-full border-b border-line bg-transparent py-3 text-sm text-ink outline-none transition-colors focus:border-burnt"
        }
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="ap-body mt-1.5 text-xs text-burnt">
          {error}
        </p>
      )}
    </div>
  );
}

