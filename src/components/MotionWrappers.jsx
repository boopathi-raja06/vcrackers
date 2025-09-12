export const SlideInRight = ({ children, ...props }) => (
  <motion.div
    initial={{ x: 60, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    viewport={{ once: true, amount: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);
import { motion } from 'framer-motion';

export const SlideInTop = ({ children, ...props }) => (
  <motion.div
    initial={{ y: -60, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    viewport={{ once: true, amount: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const SlideInLeft = ({ children, ...props }) => (
  <motion.div
    initial={{ x: -60, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    viewport={{ once: true, amount: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const SlideInBottom = ({ children, ...props }) => (
  <motion.div
    initial={{ y: 60, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    viewport={{ once: true, amount: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggeredSlideInBottom = ({ children, stagger = 0.15, ...props }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    variants={{
      visible: {
        transition: {
          staggerChildren: stagger,
        },
      },
    }}
    viewport={{ once: true, amount: 0.3 }}
    {...props}
  >
    {Array.isArray(children)
      ? children.map((child, i) => (
          <motion.div
            key={i}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {child}
          </motion.div>
        ))
      : children}
  </motion.div>
);
