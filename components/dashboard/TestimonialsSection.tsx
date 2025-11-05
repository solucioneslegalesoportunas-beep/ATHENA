
import React from 'react';
import { Testimonial } from '../../types';
import { ChatBubbleBottomCenterTextIcon } from '../shared/Icons';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Testimonios de Clientes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto pr-2">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-slate-700/50 p-4 rounded-lg flex flex-col">
            <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-indigo-400 mb-2" />
            <blockquote className="text-slate-300 text-sm italic flex-grow">"{testimonial.quote}"</blockquote>
            <footer className="mt-4 text-right">
              <p className="font-semibold text-white text-sm">{testimonial.clientName}</p>
              {testimonial.company && <p className="text-xs text-slate-400">{testimonial.company}</p>}
            </footer>
          </div>
        ))}
        {testimonials.length === 0 && (
           <div className="col-span-full text-center py-10 text-slate-500 text-sm">
             <p>Aún no hay testimonios para mostrar.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsSection;
