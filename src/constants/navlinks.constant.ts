import { Home, Briefcase, FileText, MapPin, BarChart3 } from 'lucide-react'
import { NavItem } from '../types/nav-item'

export const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Overview', icon: Home },
  { path: '/dashboard/applications', label: 'Applications', icon: Briefcase },
  { path: '/dashboard/tracking', label: 'Tracking', icon: MapPin },
  { path: '/dashboard/supplements', label: 'Documents', icon: FileText },
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 }
]
