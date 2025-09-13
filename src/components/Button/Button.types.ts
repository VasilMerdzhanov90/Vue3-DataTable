export type Variant =
    | "primary"
    | "secondary"
    | "default"
    | "ghost"
    | "success"
    | "danger";
export type Size = "xs" | "sm" | "default" | "md" | "lg";

export interface ButtonProps {
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    loading?: boolean;
    additionalClasses?: string;
}
