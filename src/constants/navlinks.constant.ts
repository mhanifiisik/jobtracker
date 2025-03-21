import { NavItem } from '@/types/nav-item'
import { Home, Briefcase, FileText, Code, ClipboardList } from 'lucide-react'

export const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/dashboard/jobs', label: 'Jobs', icon: Briefcase },
  { path: '/dashboard/applications', label: 'Applications', icon: ClipboardList },
  { path: '/dashboard/documents', label: 'Documents', icon: FileText },
  { path: '/dashboard/leetcode', label: 'LeetCode', icon: Code }
]
