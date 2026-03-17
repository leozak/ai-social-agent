import styles from "./LoadingDots.module.css";

const LoadingDots = () => {
  return (
    <span
      className={`text-neutral-400 font-bold text-lg ${styles.animatedots}`}
      aria-label="Carregando"
    ></span>
  );
};

export default LoadingDots;
