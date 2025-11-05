
import React, { useState } from 'react';
import { Testimonial } from '../../types';
import Modal from '../shared/Modal';

interface NewTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
}

const NewTestimonialModal: React.FC<NewTestimonialModalProps> = ({ isOpen, onClose, onAddTestimonial }) => {
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [quote, setQuote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !quote.trim()) {
      alert('El nombre del cliente y el testimonio son obligatorios.');
      return;
    }
    onAddTestimonial({
      clientName,
      company: company.trim() || undefined,
      quote,
    });
    // Reset form
    setClientName('');
    setCompany('');
    setQuote('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Nuevo Testimonio">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-slate-300">Nombre del Cliente</label>
                <input
                    type="text"
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-300">Empresa (Opcional)</label>
                <input
                    type="text"
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
        </div>
        <div>
          <label htmlFor="quote" className="block text-sm font-medium text-slate-300">Testimonio</label>
          <textarea
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            required
            rows={4}
            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div className="pt-4 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 hover:bg-slate-500 rounded-md">Cancelar</button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">Guardar Testimonio</button>
        </div>
      </form>
    </Modal>
  );
};

export default NewTestimonialModal;
