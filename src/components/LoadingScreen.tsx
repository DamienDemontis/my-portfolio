import { PorcoRossoLoader } from './PorcoRossoLoader'

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  return <PorcoRossoLoader onLoadingComplete={onLoadingComplete} />
}