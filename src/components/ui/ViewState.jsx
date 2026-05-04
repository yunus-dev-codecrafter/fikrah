function ViewState({ state, loadingText = 'Loading...', emptyText = 'No data.', errorText = 'Something went wrong.' }) {
  if (state === 'loading') return <p className="text-sm text-[#9A8678]">{loadingText}</p>
  if (state === 'error') return <p className="text-sm text-rose-300">{errorText}</p>
  if (state === 'empty') return <p className="text-sm text-[#9A8678]">{emptyText}</p>
  return null
}

export default ViewState
