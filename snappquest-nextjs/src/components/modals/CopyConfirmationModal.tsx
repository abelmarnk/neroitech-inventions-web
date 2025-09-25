"use client";
import { BaseModal } from './BaseModal';
import { motion } from 'framer-motion';
import { FaRegCopy } from 'react-icons/fa';

interface CopyConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  copiedText?: string;
}

export const CopyConfirmationModal: React.FC<CopyConfirmationModalProps> = ({ open, onClose, copiedText }) => {
  return (
    <BaseModal open={open} onClose={onClose} title="Copied to Clipboard">
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-emerald-600 font-medium text-lg">
          <FaRegCopy /> <span>Quest Summary Ready!</span>
        </div>
        {copiedText && (
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-900 text-gray-100 text-xs p-4 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-64"
          >{copiedText}</motion.pre>
        )}
        <p className="text-sm text-gray-600">You can now share or store this quest blueprint.</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium shadow"
          >Close</button>
        </div>
      </div>
    </BaseModal>
  );
};
