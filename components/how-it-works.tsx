import { SectionHeader } from "./section-header"

const steps = [
  {
    number: 1,
    title: "Choose & Order",
    description: "Pick the product you want and fill in the order form below with your details.",
  },
  {
    number: 2,
    title: "Transfer Payment",
    description: "Send the exact amount to our Wise or Bank of Khartoum account shown below.",
  },
  {
    number: 3,
    title: "Send Proof & Wait",
    description: "WhatsApp us your transfer receipt. We verify and confirm your order within 24 hours.",
  },
]

export function HowItWorks() {
  return (
    <section className="mb-14">
      <SectionHeader 
        title="How It Works" 
        subtitle="Simple 3-step ordering process — no account needed" 
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-white border border-border rounded-xl px-5 py-7 text-center"
          >
            <div className="w-[42px] h-[42px] bg-navy text-gold2 font-serif text-lg font-semibold rounded-full flex items-center justify-center mx-auto mb-4">
              {step.number}
            </div>
            <h3 className="text-[15px] font-medium text-navy mb-1.5">{step.title}</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
