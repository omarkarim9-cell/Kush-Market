import { SectionHeader } from "./section-header"

const wiseDetails = [
  { label: "Account Holder", value: "PLACEHOLDER NAME" },
  { label: "Email", value: "placeholder@email.com" },
  { label: "IBAN (AED)", value: "PLACEHOLDER-IBAN" },
  { label: "SWIFT/BIC", value: "PLACEHOLDER" },
]

const bokDetails = [
  { label: "Account Holder", value: "PLACEHOLDER NAME" },
  { label: "Account Number", value: "000000000" },
  { label: "Bank", value: "Bank of Khartoum" },
  { label: "Branch", value: "Placeholder Branch" },
]

export function PaymentDetails() {
  return (
    <section className="mb-10">
      <SectionHeader
        title="Payment Details"
        subtitle="Transfer the exact amount to one of the accounts below after submitting your order"
      />

      <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
        {/* Wise Card */}
        <div className="bg-white border border-border rounded-[14px] p-7">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-lg bg-[#9FE870] flex items-center justify-center text-lg">
              {"💸"}
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-navy">Wise (Recommended)</h3>
              <p className="text-xs text-muted-foreground">International — accepts most currencies</p>
            </div>
          </div>

          <div className="space-y-0">
            {wiseDetails.map((item, index) => (
              <div
                key={item.label}
                className={`flex justify-between items-start py-2 gap-3 ${
                  index < wiseDetails.length - 1 ? "border-b border-gray" : ""
                }`}
              >
                <span className="text-xs text-muted-foreground shrink-0">{item.label}</span>
                <span className="text-[13px] font-medium text-navy text-right break-all">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bank of Khartoum Card */}
        <div className="bg-white border border-border rounded-[14px] p-7">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-lg bg-[#FDE68A] flex items-center justify-center text-lg">
              {"🏦"}
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-navy">Bank of Khartoum</h3>
              <p className="text-xs text-muted-foreground">Sudan — local SDG transfer</p>
            </div>
          </div>

          <div className="space-y-0">
            {bokDetails.map((item, index) => (
              <div
                key={item.label}
                className={`flex justify-between items-start py-2 gap-3 ${
                  index < bokDetails.length - 1 ? "border-b border-gray" : ""
                }`}
              >
                <span className="text-xs text-muted-foreground shrink-0">{item.label}</span>
                <span className="text-[13px] font-medium text-navy text-right break-all">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
