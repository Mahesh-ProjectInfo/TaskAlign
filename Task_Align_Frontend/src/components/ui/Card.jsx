export default function Card({ className = "", children, ...rest }) {
  return (
    <div className={`ta-card p-6 ${className}`} {...rest}>
      {children}
    </div>
  );
}
