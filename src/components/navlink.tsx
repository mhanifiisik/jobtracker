import type { NavItem } from '@/types/nav-item';
import { Link } from 'react-router';

interface NavLinkProps {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}

const NavLink = ({ item, collapsed, active }: NavLinkProps) => {
  const Icon = item.icon;

  if (collapsed) {
    return (
      <div className="group relative">
        <Link
          to={item.path}
          className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors duration-300 ${
            active
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Icon className="h-5 w-5" />
        </Link>
        <div className="invisible absolute top-1/2 left-full z-50 ml-2 -translate-y-1/2 rounded-md bg-gray-900 px-2 py-1 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
          {item.label}
        </div>
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors duration-300 ${
        active
          ? 'bg-blue-50 font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'
      }`}
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      <span className="flex-shrink-0 whitespace-nowrap">{item.label}</span>
    </Link>
  );
};

export default NavLink;
