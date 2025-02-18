import { type Variants, motion } from 'framer-motion';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import { MovingButton } from '../../UIButton/MovingButton';
import MeSvg from './img/intro2.svg';
import React from 'react';

const variants: Variants = {
    visible: i => ({
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            damping: 25,
            stiffness: 100,
            duration: 0.3,
            delay: i * 0.3,
        },
    }),
    hidden: { opacity: 0, y: 30 },
};

function Circle() {
    return <div className={styles.circle} />;
}

function HeadGreet() {
    return (
        <motion.div
            className={styles.hero_text}
            custom={1}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            onMouseMove={(e) => {
                e.currentTarget.style.setProperty('--x', `${e.clientX}px`);
                e.currentTarget.style.setProperty('--y', `${e.clientY}px`);
            }}
        >
            <span
                className={styles.name}
                onMouseMove={(e) => {
                    const bounding = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--mouse-x', `${bounding.x}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${bounding.y}px`);
                }}
            >
                <Translate id="homepage.hero.name">Leyan</Translate>
            </span>
            <Translate id="homepage.hero.greet">的小站😉</Translate>
        </motion.div>
    );
}

export default function HeadIntro() {
    return (
        <motion.div className={styles.hero} style={{ backgroundColor: 'transparent' }}>
            <div className={styles.intro}>
                <HeadGreet />
                <motion.p custom={2} initial="hidden" animate="visible" variants={variants} className="max-lg:px-4">
                    <Translate id="homepage.hero.text">
                        一名机器人开发者，分享我在技术路上的经验和感悟。
                    </Translate>
                    <motion.div className="mt-4 flex gap-2" custom={4} initial="hidden" animate="visible" variants={variants}>
                        <MovingButton
                            borderRadius="1.25rem"
                            className="relative z-10 flex items-center rounded-2xl border-solid border-neutral-200 px-5 py-3 text-center text-base"
                            style={{ backgroundColor: 'transparent' }} 
                        >
                            <div className={styles.buttons}>
                                <Link to="/intro">
                                    <Translate>HELLO THATS ME 👉</Translate>
                                </Link>
                            </div>
                        </MovingButton>
                    </motion.div>
                </motion.p>
            </div>
            <motion.div className={styles.background}>
                <MeSvg />
                <Circle />
            </motion.div>
        </motion.div>
    );
}