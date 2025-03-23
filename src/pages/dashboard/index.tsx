import { toast } from 'react-hot-toast'

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <button type="button" onClick={() => toast('Succes')}>
        Click{' '}
      </button>
    </div>
  )
}
