import { useQuery } from '@tanstack/react-query'

const getAllJobs = (async = () => {
  const {} = useQuery('jobs', async () => {
    const response = await fetch('https://api.example.com/jobs')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
})
