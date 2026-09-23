import React, { useState, useRef, useEffect } from 'react'

interface VisitorNameInputProps {
  onSubmit: (name: string) => void
  disabled?: boolean
}

export const VisitorNameInput: React.FC<VisitorNameInputProps> = ({ onSubmit, disabled = false }) => {
  const [name, setName] = useState('')
  const [hasError, setHasError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Autofocus input on desktop devices
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setHasError(true)
      inputRef.current?.focus()
      return
    }
    setHasError(false)
    onSubmit(trimmed)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (hasError) setHasError(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs mx-auto flex flex-col items-center space-y-3">
      <div className="w-full flex flex-col items-center space-y-1.5">
        <label
          htmlFor="visitor-name-input"
          className="text-xs sm:text-sm font-semibold text-slate-100 tracking-wide text-center drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]"
        >
          Who's entering?
        </label>

        {/* Windows 11-style input container with integrated submit arrow */}
        <div
          className={`relative w-full flex items-center rounded-lg transition-all duration-200 ${
            hasError
              ? 'border border-rose-500/80 ring-2 ring-rose-500/20 bg-black/60 shadow-lg'
              : 'border border-white/30 bg-black/60 backdrop-blur-md focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/30 shadow-lg'
          }`}
        >
          <input
            id="visitor-name-input"
            ref={inputRef}
            type="text"
            value={name}
            onChange={handleChange}
            placeholder="Enter your name..."
            disabled={disabled}
            maxLength={32}
            autoComplete="off"
            spellCheck={false}
            className="w-full h-10 pl-3.5 pr-10 bg-transparent text-sm text-slate-100 font-medium placeholder:text-slate-300 placeholder:text-xs placeholder:font-medium outline-none disabled:opacity-50"
          />

          {/* Windows-style submit button inside field */}
          <button
            type="submit"
            disabled={disabled || !name.trim()}
            aria-label="Enter Workspace"
            title="Enter Workspace"
            className={`absolute right-1 w-8 h-8 rounded-md flex items-center justify-center transition-all duration-150 ${
              name.trim() && !disabled
                ? 'text-slate-100 bg-white/10 hover:bg-[var(--accent)] hover:text-[var(--text-inverse)] active:scale-95 cursor-pointer'
                : 'text-slate-600 bg-transparent cursor-not-allowed'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 3L11 8L6 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Validation alert / Empty feedback */}
      {hasError && (
        <span className="text-[11px] text-rose-400 font-medium tracking-tight animate-fade-in text-center">
          Please enter your name to proceed
        </span>
      )}

      {/* Primary explicit submit button matching input width & height */}
      <button
        type="submit"
        disabled={disabled || !name.trim()}
        className={`w-full h-10 px-4 rounded-lg text-xs font-medium tracking-wide flex items-center justify-center space-x-2 transition-all duration-150 ${
          name.trim() && !disabled
            ? 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-inverse)] shadow-md shadow-cyan-950/40 cursor-pointer active:scale-[0.99]'
            : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
        }`}
      >
        <span>Enter Workspace</span>
        <span>→</span>
      </button>
    </form>
  )
}
