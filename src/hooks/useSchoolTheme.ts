'use client'
// Watches the data-school attribute on <html> and returns the active school.
import { useEffect, useState } from 'react'
import { SCHOOLS, type School, type SchoolId } from '@/data/schools'

export function useSchoolTheme(): { schoolId: SchoolId | null; school: School | null } {
  const [schoolId, setSchoolId] = useState<SchoolId | null>(null)

  useEffect(() => {
    const el = document.documentElement

    // Read initial value (set by AdmissionsModal before first render)
    const init = el.getAttribute('data-school') as SchoolId | null
    setSchoolId(init)

    // Watch for future attribute changes (school picker or reset)
    const observer = new MutationObserver(() => {
      const val = el.getAttribute('data-school') as SchoolId | null
      setSchoolId(val)
    })
    observer.observe(el, { attributes: true, attributeFilter: ['data-school'] })
    return () => observer.disconnect()
  }, [])

  const school = schoolId ? (SCHOOLS.find((s) => s.id === schoolId) ?? null) : null
  return { schoolId, school }
}
