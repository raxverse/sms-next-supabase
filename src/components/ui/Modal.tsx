'use client'

import { useEffect, useRef, useState } from 'react'
import { X, CircleAlert as AlertCircle } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl transform transition-all duration-200 overflow-hidden`}
        style={{ animation: 'modalFadeIn 0.2s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

// Form Field Components
export function FormField({
  label,
  error,
  required,
  hint,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  )
}

export function Input({
  error,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      className={`
        w-full h-10 px-3 rounded-lg text-sm
        bg-white border
        ${error ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-[#7b1d2f]'}
        text-slate-900
        placeholder:text-slate-400
        focus:outline-none focus:ring-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${className}
      `}
      {...props}
    />
  )
}

export function Select({
  error,
  className = '',
  options,
  placeholder = 'Select...',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}) {
  return (
    <select
      className={`
        w-full h-10 px-3 rounded-lg text-sm appearance-none
        bg-white border
        ${error ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-[#7b1d2f]'}
        text-slate-900
        focus:outline-none focus:ring-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${className}
      `}
      {...props}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export function Textarea({
  error,
  className = '',
  rows = 3,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <textarea
      rows={rows}
      className={`
        w-full px-3 py-2 rounded-lg text-sm
        bg-white border
        ${error ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-[#7b1d2f]'}
        text-slate-900
        placeholder:text-slate-400
        focus:outline-none focus:ring-2
        disabled:opacity-50 disabled:cursor-not-allowed
        resize-y
        transition-colors
        ${className}
      `}
      {...props}
    />
  )
}

// Modal Actions
export function ModalActions({
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false,
  disabled = false,
}: {
  onSubmit?: () => void
  onCancel: () => void
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50"
      >
        {cancelLabel}
      </button>
      {onSubmit && (
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || disabled}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#7b1d2f] hover:bg-[#931f38] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {submitLabel}
        </button>
      )}
    </div>
  )
}
