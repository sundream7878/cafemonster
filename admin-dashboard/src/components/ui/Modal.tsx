
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg z-50"
                    >
                        <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl", className)}>
                            <div className="flex items-center justify-between border-b border-slate-50 p-6 bg-slate-50/30">
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
                                <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 btn-ghost-premium">
                                    <X className="h-5 w-5 text-slate-400" />
                                </Button>
                            </div>
                            <div className="p-4 sm:p-6 text-left">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
