"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { LucideIcon } from "lucide-react";

/* Base Input */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-text)] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-light)]">
              <LeftIcon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full h-10 px-3 rounded-lg text-sm
              bg-[var(--color-surface)]
              border border-[var(--color-border)]
              text-[var(--color-text)]
              placeholder:text-[var(--color-text-light)]
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-[var(--transition-fast)]
              ${LeftIcon ? "pl-10" : ""}
              ${RightIcon ? "pr-10" : ""}
              ${
                error
                  ? "border-[var(--color-error)] focus:ring-[var(--color-error)]"
                  : ""
              }
              ${className}
            `}
            {...props}
          />
          {RightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              disabled={!onRightIconClick}
              className={`
                absolute right-3 top-1/2 -translate-y-1/2
                text-[var(--color-text-light)]
                ${onRightIconClick ? "cursor-pointer hover:text-[var(--color-text)]" : ""}
              `}
            >
              <RightIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-[var(--color-error)]">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

/* Textarea */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-[var(--color-text)] mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-3 py-2.5 rounded-lg text-sm min-h-[100px]
            bg-[var(--color-surface)]
            border border-[var(--color-border)]
            text-[var(--color-text)]
            placeholder:text-[var(--color-text-light)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-y
            transition-colors duration-[var(--transition-fast)]
            ${
              error
                ? "border-[var(--color-error)] focus:ring-[var(--color-error)]"
                : ""
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-[var(--color-error)]">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

/* Select */
interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, hint, options, className = "", id, ...props },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[var(--color-text)] mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full h-10 px-3 rounded-lg text-sm appearance-none
            bg-[var(--color-surface)]
            border border-[var(--color-border)]
            text-[var(--color-text)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-[var(--transition-fast)]
            ${
              error
                ? "border-[var(--color-error)] focus:ring-[var(--color-error)]"
                : ""
            }
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-xs text-[var(--color-error)]">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

/* Search Input */
import { Search } from "lucide-react";

interface SearchInputProps extends Omit<InputProps, "leftIcon"> {
  onSearch?: (value: string) => void;
}

export function SearchInput({ onSearch, ...props }: SearchInputProps) {
  return (
    <Input
      leftIcon={Search}
      placeholder="Search..."
      {...props}
    />
  );
}

export default Input;
