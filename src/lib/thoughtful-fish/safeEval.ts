import { VM } from 'vm2'

export default function safeEval(expression: string, globals: Record<string, unknown>) {
  return new VM({ sandbox: globals }).run(expression)
}
