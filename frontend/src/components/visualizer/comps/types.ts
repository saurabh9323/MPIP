/* eslint-disable @typescript-eslint/no-explicit-any */
export interface StackFrame {
  name: string
  address: string
}

export interface HeapObject {
  id: string
  type: string
  address: string
  data: Record<string, any>
}

export interface Step {
  id: number
  title: string
  description: string
  stack?: StackFrame[]
  heap?: HeapObject[]
  variables?: Record<string, any>
}

export interface StepsData {
  meta: {
    problem: string
    language: string
  }
  steps: Step[]
}
