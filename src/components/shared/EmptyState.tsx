
import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/30 rounded-lg border border-border/40 min-h-[300px]">
      <div className="rounded-full bg-muted p-4 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-md mb-6">
        {description}
      </p>
      {action}
    </div>
  );
};

export default EmptyState;
