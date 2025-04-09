"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { config } from "@/config";
import { motion, AnimatePresence } from "framer-motion";

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { type: "spring", bounce: 0, duration: 0.4 };

const FeaturesHeader = () => {
  const pathname = usePathname();

  return (
    <nav>
      <div className="flex items-center">
        <div className="flex items-center gap-3 border rounded-lg p-3">
          {config.routes.map((item) => {
            const IconComponent = item.icon;
            const isSelected = pathname.includes(item.href);

            return (
              <motion.div
                key={item.name}
                className="relative flex items-center"
                style={{ width: isSelected ? "auto" : "40px" }}
              >
                <Link href={item.href} className="flex items-center w-full">
                  <motion.div
                    variants={buttonVariants}
                    initial="initial"
                    animate="animate"
                    custom={isSelected}
                    transition={transition}
                    className={`flex items-center rounded-lg w-full ${
                      isSelected
                        ? "bg-black text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-center py-2 px-1">
                      <IconComponent
                        size={18}
                        className={isSelected ? "text-white" : ""}
                      />
                      <AnimatePresence initial={false} mode="wait">
                        {isSelected && (
                          <motion.span
                            variants={spanVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={transition}
                            className="overflow-hidden ml-2 whitespace-nowrap"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default FeaturesHeader;
