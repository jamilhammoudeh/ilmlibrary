"use client";

type FieldBaseProps = {
  label: string;
  hint?: string;
  required?: boolean;
};

type InputFieldProps = FieldBaseProps & React.InputHTMLAttributes<HTMLInputElement> & {
  textarea?: false;
};

type TextareaFieldProps = FieldBaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  textarea: true;
};

const baseCls =
  "w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-transparent transition-shadow duration-150";

export function Field(props: InputFieldProps | TextareaFieldProps) {
  if (props.textarea) {
    const { label, hint, required, textarea: _t, ...rest } = props;
    void _t;
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        <textarea
          {...rest}
          required={required}
          rows={rest.rows ?? 4}
          className={`${baseCls} resize-none`}
        />
        {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      </div>
    );
  }
  const { label, hint, required, textarea: _t, ...rest } = props;
  void _t;
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <input {...rest} required={required} className={baseCls} />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export function SelectField({
  label,
  hint,
  required,
  children,
  ...rest
}: FieldBaseProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <select {...rest} required={required} className={baseCls}>
        {children}
      </select>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 bg-teal-900 hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-md transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-md transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
