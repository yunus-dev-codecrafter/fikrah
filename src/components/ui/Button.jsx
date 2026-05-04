function Button({ children, type = 'button', onClick, variant = 'primary', className = '' }) {
  const variantClasses =
    variant === 'ghost'
      ? 'border border-[#9A8678] bg-transparent text-[#CAAA98] hover:bg-[#CAAA98]/10'
      : 'bg-[#CAAA98] text-[#202940] hover:bg-[#d7b7a5]'

  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${variantClasses} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
