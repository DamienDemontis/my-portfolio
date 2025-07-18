import { memo, ReactNode } from 'react'

interface MemoizedSectionProps {
  children: ReactNode
  className?: string
  id?: string
}

export const MemoizedSection = memo(({ children, className, id }: MemoizedSectionProps) => {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for when to re-render
  return (
    prevProps.className === nextProps.className &&
    prevProps.id === nextProps.id
  )
})

MemoizedSection.displayName = 'MemoizedSection' 