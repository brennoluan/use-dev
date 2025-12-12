import styles from "./FooterSection.module.css";
import Typography from "../Typography";

type FooterSectionProps = {
  readonly title: string;
  readonly items: string[];
};

export default function FooterSection({
  title,
  items,
  ...rest
}: FooterSectionProps) {
  return (
    <div className={styles.section} {...rest}>
      <Typography variantStyle="bodyLargeBold">{title}</Typography>
      <ul>
        {items.map((item) => (
          <li key={`footer-item-${item}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
