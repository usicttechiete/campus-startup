import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <div className="flex space-x-1 p-2">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="h-2 w-2 rounded-full bg-indigo-400"
          animate={{
            y: ['0%', '-50%', '0%'],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: dot * 0.1,
          }}
        />
      ))}
    </div>
  );
};

export default TypingIndicator;
