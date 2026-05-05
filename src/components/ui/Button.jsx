function Button({ children, type = 'button', onClick, variant = 'primary', className = '' }) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200',
    secondary: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-600 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200',
    ghost: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md transition-all duration-200',
    outline: 'border-2 border-emerald-500 text-emerald-600 bg-white hover:bg-emerald-50 hover:border-emerald-600 transition-all duration-200',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:from-red-600 hover:to-red-700 transform hover:scale-[1.02] transition-all duration-200',
    success: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition-all duration-200'
  }

  const baseClasses = 'rounded-xl px-6 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
