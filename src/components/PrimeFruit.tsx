export function PrimeFruit({ priority = false }: { priority?: boolean }) {
  return (
    <div className="real-fruit-track" aria-hidden="true">
      <img
        className="real-fruit-photo"
        src="/images/strawberry-prime.webp"
        width="1213"
        height="1297"
        alt=""
        fetchPriority={priority ? 'high' : 'auto'}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  )
}
