'use client';

import React, { useRef, useState } from 'react';

import InputField from './InputField';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

const Form = () => {
  const form = useRef<HTMLFormElement | null>(null);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    note: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    const parameters = {
      name: formData.name,
      note: formData.note,
      to_name: 'Muqtadirat',
    };

    setSending(true);

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        parameters,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      )
      .then(
        () => {
          toast.success('Thank you for reaching out!');
          setFormData({ name: '', note: '' });
          form.current?.reset();
        },
        () => {
          toast.error('Email failed to send');
        },
      )
      .catch((error: string) => console.log(error))
      .finally(() => setSending(false));
  };

  const isDisabled =
    sending ||
    !formData.name.trim() ||
    !formData.note.trim() ||
    formData.note.trim().length < 20;

  return (
    <div className="max-w-[1000px] mx-auto">
      <p className="mx-auto text-center text-3xl lg:text-[5.5rem] max-w-xs lg:max-w-full lg:leading-[0.95] font-display font-bold uppercase tracking-tight mb-9 mt-10 lg:mb-14">
        Talk to me about a project and let’s do{' '}
        <span className="text-accent italic font-medium normal-case tracking-normal">
          great work
        </span>
      </p>

      <form
        ref={form}
        onSubmit={sendEmail}
        method="post"
        className="space-y-6 lg:space-y-8"
      >
        <div>
          <InputField
            type="text"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g Takezi Kensei Akinola"
          />
        </div>
        <div>
          <InputField
            type="text"
            name="note"
            label="Additional note"
            value={formData.note}
            onChange={handleInputChange}
            placeholder="I'd like to speak to you about..."
          />
          {formData.note.length > 0 && formData.note.trim().length < 20 && (
            <p className="text-xs text-text-secondary mt-1">
              {20 - formData.note.trim().length} more character
              {20 - formData.note.trim().length === 1 ? '' : 's'} needed
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`mt-6 lg:mt-10 py-3 px-4 rounded-lg font-semibold transition-all duration-500 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-default
    ${
      isDisabled
        ? 'bg-text-hovered text-background-default/40 cursor-not-allowed'
        : 'bg-accent text-background-default hover:bg-background-default hover:text-accent hover:outline-solid outline-2 outline-accent'
    }`}
        >
          {sending ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  );
};

export default Form;
