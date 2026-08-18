export interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "tel" | "numeric" | "email";
  autoComplete?: string;
  error?: string;
}

/** Campo de formulário do fluxo — label ligado por id e erro anunciado por role="alert". */
export function Field({ id, label, value, onChange, error, type = "text", ...rest }: FieldProps) {
  return (
    <div className="lp-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        {...rest}
      />
      {error && (
        <span className="lp-field__err" id={`${id}-err`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
