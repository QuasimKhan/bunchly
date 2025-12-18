import { motion } from "framer-motion";

const AnimateOnScroll = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
        {children}
    </motion.div>
);

export default AnimateOnScroll;
