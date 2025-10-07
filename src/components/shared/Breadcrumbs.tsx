import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li key="home">
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                {item.label}
              </Link>
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