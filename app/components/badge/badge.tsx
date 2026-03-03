export default function Badge({
  variant,
  children,
}: {
  variant: string;
  children: React.ReactNode;
}) {
  const variantClass =
    {
      primary: "bg-blue-50 text-blue-400",
      danger: "bg-red-50 text-red-400",
    }[variant] ?? "";

  return (
    <span
      className={`rounded-lg text-xs leading-none font-bold h-[25px] py-1 px-2 inline-flex items-center justify-center ${variantClass}`}
    >
      {children}
    </span>
  );
}
