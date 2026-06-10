import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-color)]">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-[var(--text-color)]/60">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface FormGroupProps {
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
}

export function FormGroup({
  label,
  children,
  error,
  required,
}: FormGroupProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--label-color)]">
        {label}
        {required && <span className="text-[#e74c3c]"> *</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p className="mt-1 text-sm text-[#e74c3c]">{error}</p>
      )}
    </div>
  );
}
