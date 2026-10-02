"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/site";
import { useDemo } from "./providers";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.56.93.95-3.47-.22-.36A9.4 9.4 0 0 1 2.63 12a9.43 9.43 0 0 1 16.1-6.66A9.36 9.36 0 0 1 21.5 12c0 5.2-4.23 9.5-9.45 9.5m8.04-17.53A11.3 11.3 0 0 0 12.05.64C5.78.64.68 5.73.68 12c0 2 .52 3.96 1.52 5.68L.58 23.36l5.82-1.52a11.34 11.34 0 0 0 5.65 1.44h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.03-1.18-5.89-3.33-8.03" />
    </svg>
  );
}

/** Bouton WhatsApp flottant : apparaît après un léger défilement, masqué quand la fenêtre de démo est ouverte. */
export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const { isOpen } = useDemo();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && !isOpen && (
        <motion.a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Écrire à CliniquePro sur WhatsApp"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="group fixed right-4 bottom-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3 text-white shadow-[0_12px_40px_-8px_rgba(37,211,102,0.7)] md:right-6 md:bottom-6"
        >
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.8s]" />
          <WhatsAppIcon className="size-6" />
          <span className="hidden max-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap transition-all duration-300 group-hover:max-w-40 group-hover:pr-1 md:inline">
            Écrivez-nous
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}

export { WhatsAppIcon };
