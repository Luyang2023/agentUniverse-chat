import classnames from "classnames"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: (string | undefined)[]) {
  return twMerge(classnames(inputs))
}
