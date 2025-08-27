"use client"

import { useState } from "react"
import { useMultiAgentStream } from "@/hooks/useMultiAgentStream"
import { buildOKRPrompt, type PlanInputs } from "@/lib/planPrompt"

const defaults: PlanInputs = {
  businessName: "Summon Experts Demo Co.",
  revenueGoal: "25000",
  customerGoal: "40",
  challenges: "Limited ad budget, need to scale efficiently",
  availability: "20"
}

export default function PlanTest() {
  const [inputs, setInputs] = useState<PlanInputs>(defaults)
  const { messages, sendMessage } = useMultiAgentStream()

  async function onRun() {
    const prompt = buildOKRPrompt(inputs)
    await sendMessage(prompt)
  }

  return (
    <div className="space-y-4">
      <button
        onClick={onRun}
        className="px-4 py-2 rounded-xl bg-black text-white"
      >
        Run 90-Day Plan (test inputs)
      </button>

      <div className="space-y-2 max-h-[60vh] overflow-auto border rounded-xl p-3">
        {messages.map((m, i) => (
          <div key={i} className="text-sm leading-relaxed">
            <span className="font-semibold">{m.name ?? m.role}</span>: {m.content}
          </div>
        ))}
      </div>
    </div>
  )
}
