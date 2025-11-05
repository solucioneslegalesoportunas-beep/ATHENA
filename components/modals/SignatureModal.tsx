import React, { useRef } from 'react';
import Modal from '../shared/Modal';
import SignaturePad from '../shared/SignaturePad';
import type { SignaturePadRef } from '../shared/SignaturePad';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
  taskTitle: string;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSave, taskTitle }) => {
  const signaturePadRef = useRef<SignaturePadRef>(null);

  const handleClear = () => {
    signaturePadRef.current?.clear();
  };

  const handleSave = () => {
    if (signaturePadRef.current?.isEmpty()) {
      alert('La firma no puede estar vacía.');
      return;
    }
    const signatureDataUrl = signaturePadRef.current?.toDataURL();
    if (signatureDataUrl) {
      onSave(signatureDataUrl);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Firma de Aprobación del Cliente">
        <div className="p-4">
            <p className="text-sm text-slate-400 mb-4">
                Por favor, firme en el siguiente recuadro para confirmar la aprobación de la tarea: <span className="font-semibold text-slate-200">"{taskTitle}"</span>
            </p>
            <div className="bg-white rounded-lg border-2 border-dashed border-slate-400 overflow-hidden">
                <SignaturePad ref={signaturePadRef} />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 hover:bg-slate-500 rounded-md"
                >
                    Limpiar
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                    Guardar Firma
                </button>
            </div>
        </div>
    </Modal>
  );
};

export default SignatureModal;