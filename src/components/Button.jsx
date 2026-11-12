import { Link } from "react-router-dom";
export default function Button({
  to,
  children,
  secondary = false,
  className = "",
  ...props
}) {
  const styles = `inline-flex items-center justify-center gap-2.5 rounded-lg px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 ${secondary ? "border border-line bg-paper hover:border-brown/40" : "border border-brown bg-brown text-white hover:bg-[#62412e] shadow-sm"} ${className}`;
  return to ? (
    <Link to={to} className={styles} {...props}>
      {children}
    </Link>
  ) : (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
