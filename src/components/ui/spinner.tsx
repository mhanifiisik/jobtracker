export default function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`text-primary inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
