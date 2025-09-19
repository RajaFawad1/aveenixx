import { ReactNode } from 'react';

interface BaseLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
}

export default function BaseLayout({ children, header, footer, sidebar }: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {header}
      <div className="flex">
        {sidebar}
        <main className="flex-1">
          {children}
        </main>
      </div>
      {footer}
    </div>
  );
}