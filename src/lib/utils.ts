export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[]

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []
  const process = (val: ClassValue) => {
    if (!val) return
    if (typeof val === 'string' || typeof val === 'number') {
      classes.push(String(val))
    } else if (Array.isArray(val)) {
      val.forEach(process)
    } else if (typeof val === 'object') {
      for (const k in val) {
        if (val[k]) classes.push(k)
      }
    }
  }
  inputs.forEach(process)
  return classes.filter(Boolean).join(' ')
}


