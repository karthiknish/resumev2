import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Refactored Modal to be more generic
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="relative z-50" // Increased z-index
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={onClose} // Close on backdrop click
          />

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              {/* Modal Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border-2 border-purple-200"
              >
                {/* Modal Content */}
                <div className="bg-white/95 backdrop-blur-sm px-4 pt-5 pb-4 sm:p-6 sm:pb-4 text-gray-800">
                  {children} {/* Render children passed to the modal */}
                </div>
                {/* Optional Footer - can be added via children if needed */}
                {/* Example Footer (remove or modify as needed):
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-purple-200">
                  <button
                    onClick={onClose}
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 sm:mt-0 sm:w-auto"
                  >
                    Close
                  </button>
                </div>
                 */}
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
