// SkipIntroButton.jsx — sets state to 'skipped' and scrolls to Work
import { useExperienceStore } from '../store/experienceStore.js'

export function SkipIntroButton() {
  const skip = useExperienceStore((s) => s.skip)

  const handleClick = () => {
    skip()
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <button type="button" className="btn btn--ghost mono" onClick={handleClick}>
      Skip intro ↓
    </button>
  )
}