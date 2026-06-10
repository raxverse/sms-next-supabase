import React, { CSSProperties, ReactNode } from 'react';

// ------------------------------------------------------------------
// 1. Common Props (Jo sabme use honge)
// ------------------------------------------------------------------
export interface SharedStyleProps {
  bg?: string;
  color?: string;
  p?: string | number;       // Padding
  m?: string | number;       // Margin
  textSize?: string | number;
  weight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
  align?: 'left' | 'center' | 'right' | 'justify';
  style?: CSSProperties;     // Custom inline styles ke liye
}

const mapStyles = (props: SharedStyleProps): CSSProperties => ({
  backgroundColor: props.bg,
  color: props.color,
  padding: props.p,
  margin: props.m,
  fontSize: props.textSize,
  fontWeight: props.weight,
  textAlign: props.align,
  ...props.style,
});

// ------------------------------------------------------------------
// 2. Text Component (For short text, titles, or inline text)
// ------------------------------------------------------------------
export interface TextProps extends SharedStyleProps, React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export const Text: React.FC<TextProps> = ({
  bg, color, p, m, textSize, weight, align, style, children, ...rest
}) => {
  const mergedStyles = mapStyles({ bg, color, p, m, textSize, weight, align, style });

  return (
    <span style={mergedStyles} {...rest}>
      {children}
    </span>
  );
};

// ------------------------------------------------------------------
// 3. Paragraph Component (For long text blocks)
// ------------------------------------------------------------------
export interface ParagraphProps extends SharedStyleProps, React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
  lineHeight?: string | number;
}

export const Paragraph: React.FC<ParagraphProps> = ({
  bg, color, p, m, textSize, weight, align, style, lineHeight = '1.6', children, ...rest
}) => {
  const mergedStyles: CSSProperties = {
    ...mapStyles({ bg, color, p, m, textSize, weight, align, style }),
    lineHeight, // Paragraphs padhne mein aasan hon isliye thoda gap zaroori hai
  };

  return (
    <p style={mergedStyles} {...rest}>
      {children}
    </p>
  );
};

// ------------------------------------------------------------------
// 4. Button Component (Interactive clicks ke liye)
// ------------------------------------------------------------------
export interface ButtonProps extends SharedStyleProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  bg = '#0070f3', // Default theme color
  color = '#ffffff',
  p = '12px 24px',
  m, textSize = '16px', weight = 'bold', align, style, 
  variant = 'solid', fullWidth = false, children, ...rest
}) => {
  const isOutline = variant === 'outline';

  const baseStyles: CSSProperties = {
    ...mapStyles({ p, m, textSize, weight, align, style }),
    backgroundColor: isOutline ? 'transparent' : bg,
    color: isOutline ? bg : color,
    border: isOutline ? `2px solid ${bg}` : 'none',
    width: fullWidth ? '100%' : 'auto',
    cursor: rest.disabled ? 'not-allowed' : 'pointer',
    opacity: rest.disabled ? 0.6 : 1,
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    display: 'inline-block',
  };

  return (
    <button style={baseStyles} {...rest}>
      {children}
    </button>
  );
};