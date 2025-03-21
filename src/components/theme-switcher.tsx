import useTheme from '@/utils/use-theme'
import { Moon, Sun } from 'lucide-react'
import { Dropdown } from './dropdown'

type ThemeOption = 'light' | 'dark'

const ThemeSwitcher = () => {
  const { theme, handleThemeChange } = useTheme()

  const themeOptions = [
    {
      value: 'light' as ThemeOption,
      label: <Sun className="h-5 w-5" />
    },
    {
      value: 'dark' as ThemeOption,
      label: <Moon className="h-5 w-5" />
    }
  ]

  return (
    <Dropdown
      options={themeOptions}
      defaultValue={themeOptions.find((option) => option.value === theme)}
      onChange={(option) => {
        handleThemeChange(option.value)
      }}
      className="flex h-10 w-10 items-center justify-center"
    />
  )
}

export default ThemeSwitcher
