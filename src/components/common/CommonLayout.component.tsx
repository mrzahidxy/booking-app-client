import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CommonLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      {children}
    </div>
  );
}
