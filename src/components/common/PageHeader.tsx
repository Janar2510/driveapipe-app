import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="pb-5 border-b border-white/10 sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-300">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="mt-3 sm:mt-0 sm:ml-4">{actions}</div>
      )}
    </div>
  );
};

export default PageHeader;