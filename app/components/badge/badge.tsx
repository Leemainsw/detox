type BadgeVariant = "primary" | "danger";

const variantClass: Record<BadgeVariant, string> = {
  primary: "bg-blue-50 text-blue-400",
  danger: "bg-red-50 text-red-400",
};

export default function Badge({
  variant,
  children,
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`rounded-lg text-xs leading-none font-bold h-[25px] py-1 px-2 inline-flex items-center justify-center ${variantClass[variant]}`}
    >
      {children}
    </span>
  );
}
