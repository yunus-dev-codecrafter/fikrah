function ViewState({ state, loadingText = 'Loading...', emptyText = 'No data available.', errorText = 'Something went wrong.' }) {
  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-3"></div>
        <p className="text-sm text-gray-500 font-medium">{loadingText}</p>
      </div>
    )
  }
  
  if (state === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="h-12 w-12 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm text-red-600 font-medium">{errorText}</p>
      </div>
    )
  }
  
  if (state === 'empty') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-sm text-gray-500 font-medium">{emptyText}</p>
      </div>
    )
  }
  
  return null
}

export default ViewState
