"use client";
import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  widthClass?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({ open, onClose, title, children, widthClass = '' }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  
  return (
    <div className={`modal ${open ? 'active' : ''}`} style={{ display: open ? 'block' : 'none' }}>
      <div className={`modal-content ${widthClass}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
