/* eslint-disable @next/next/no-html-link-for-pages */
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { ReactNode } from 'react';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  icon?: ReactNode;
}

export function Breadcrumbs({ items, icon }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {icon && (
          <li className="flex items-center">
            <div className="p-1 bg-gray-100 rounded-md">
              {icon}
            </div>
          </li>
        )}
        <li key="home">
          <a 
            href="/" 
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Home
          </a>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            {item.href && index < items.length - 1 ? (
              <a
                href={item.href}
                className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                {item.label}
              </a>
            ) : (
              <span className="ml-2 text-sm font-medium text-gray-900">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}