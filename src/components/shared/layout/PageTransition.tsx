import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { pageVariants, pageTransition } from "../../../lib/animations";

export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}
