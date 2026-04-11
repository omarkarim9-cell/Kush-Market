export type Lang = "en" | "ar"

export const t = {
  en: {
    // Navbar
    nav: {
      shop: "Shop",
      howItWorks: "How It Works",
      order: "Order",
      payment: "Payment",
      whatsapp: "WhatsApp Us",
    },

    // Hero
    hero: {
      badge: "Official Store",
      title: "Kush Shop",
      subtitle: "Browse our products, place your order, and complete payment via bank transfer. We verify and confirm within 24 hours.",
    },

    // How It Works
    how: {
      title: "How It Works",
      subtitle: "Simple 3-step ordering process — no account needed",
      steps: [
        { num: "1", title: "Choose & Order", desc: "Pick the product you want and fill in the order form below with your details." },
        { num: "2", title: "Transfer Payment", desc: "Send the exact amount to our Wise or Bank of Khartoum account shown below." },
        { num: "3", title: "Send Proof & Wait", desc: "WhatsApp us your transfer receipt. We verify and confirm your order within 24 hours." },
      ],
    },

    // Products
    products: {
      title: "Our Products",
      subtitle: 'Click "Order Now" on any product to jump to the order form',
      search: "Search products...",
      loading: "Loading products...",
      noResults: "No products found",
      outOfStock: "Out of Stock",
      orderNow: "Order Now",
      all: "All",
    },

    // Shipping Calculator
    shipping: {
      title: "Shipping Estimator",
      subtitle: "Get an approximate shipping cost to your location. Final rate confirmed at checkout.",
      country: "Destination Country *",
      countryPlaceholder: "Type to search country...",
      weight: "Estimated Weight (kg)",
      calculate: "Calculate Shipping →",
      estimatesFor: "Showing estimates for",
      methods: {
        courier: { label: "Express Courier", desc: "DHL / FedEx / Aramex" },
        air: { label: "Air Cargo", desc: "Standard air freight" },
        sea: { label: "Sea Cargo", desc: "Economy sea freight" },
      },
      warning: "These are estimates only. Final shipping cost depends on actual package dimensions, weight, and carrier rates at time of shipment. We will confirm the exact cost via WhatsApp before you make payment.",
      noData: "We don't have shipping estimates for this country yet. Please contact us on WhatsApp for a custom quote.",
    },

    // Order Form
    form: {
      title: "Place Your Order",
      subtitle: "Fill in your details and we'll confirm via WhatsApp",
      fullName: "Full Name *",
      fullNamePlaceholder: "Your full name",
      email: "Email Address *",
      emailPlaceholder: "you@email.com",
      phone: "Phone / WhatsApp *",
      phonePlaceholder: "50 000 0000",
      country: "Country *",
      countryPlaceholder: "Type to search country...",
      product: "Product *",
      productPlaceholder: "— Select a product —",
      quantity: "Quantity *",
      payment: "Payment Method *",
      paymentWise: "Wise",
      paymentWiseSub: "International",
      paymentBok: "Bank of Khartoum",
      paymentBokSub: "Sudan",
      city: "City *",
      cityPlaceholder: "e.g. Dubai",
      notes: "Additional Notes",
      notesOptional: "(optional)",
      notesPlaceholder: "Any special requests, questions, or details...",
      subtotal: "Products Subtotal",
      shippingNote: "Shipping not included.",
      shippingNoteDesc: "Final shipping cost will be calculated based on your location and communicated via WhatsApp before payment. Total above reflects product price only.",
      terms: "I agree to the",
      termsLink: "Terms & Conditions",
      termsRest: ", including the shipping policy and manual payment process. I understand that my order is confirmed only after payment verification.",
      submit: "Submit Order & Open WhatsApp →",
      submitting: "Submitting...",
      hint: "Your order will be saved and a WhatsApp message will open automatically",
      noCountry: "No results",
    },

    // Payment Details
    payment: {
      title: "Payment Details",
      subtitle: "Transfer the exact amount to one of the accounts below after submitting your order",
      wise: { title: "Wise (Recommended)", sub: "International — accepts most currencies" },
      bok: { title: "Bank of Khartoum", sub: "Sudan — local transfers" },
      fields: {
        accountName: "Account Name",
        email: "Email",
        currency: "Currency",
        reference: "Reference",
        accountNumber: "Account Number",
        iban: "IBAN",
      },
    },

    // Proof Box
    proof: {
      title: "After transferring, send your payment proof via WhatsApp",
      desc1: "Take a screenshot of your transfer receipt and send it to us on WhatsApp at",
      desc2: "Include your full name and the product you ordered. We will verify your payment and send you an official invoice within 24 hours.",
    },

    // Footer
    footer: {
      rights: "© 2026 Kush Educational Services — UAE",
    },

    // Success Modal
    modal: {
      title: "Order Received!",
      desc: "Thank you for your order. Please now transfer the payment and send your receipt via WhatsApp to",
      desc2: "We'll confirm within 24 hours.",
      btn: "Got it",
    },
  },

  ar: {
    nav: {
      shop: "المتجر",
      howItWorks: "كيف يعمل",
      order: "اطلب الآن",
      payment: "الدفع",
      whatsapp: "واتساب",
    },

    hero: {
      badge: "المتجر الرسمي",
      title: "متجر كوش",
      subtitle: "تصفح منتجاتنا، قدّم طلبك، وأكمل الدفع عبر التحويل البنكي. نتحقق ونؤكد خلال 24 ساعة.",
    },

    how: {
      title: "كيف يعمل المتجر",
      subtitle: "عملية طلب بسيطة من 3 خطوات — لا حساب مطلوب",
      steps: [
        { num: "١", title: "اختر واطلب", desc: "اختر المنتج الذي تريده واملأ نموذج الطلب أدناه بتفاصيلك." },
        { num: "٢", title: "حوّل المبلغ", desc: "أرسل المبلغ المحدد إلى حساب Wise أو بنك الخرطوم المذكور أدناه." },
        { num: "٣", title: "أرسل الإيصال وانتظر", desc: "أرسل إيصال التحويل عبر واتساب. نتحقق ونؤكد طلبك خلال 24 ساعة." },
      ],
    },

    products: {
      title: "منتجاتنا",
      subtitle: 'انقر على "اطلب الآن" على أي منتج للانتقال إلى نموذج الطلب',
      search: "ابحث عن منتج...",
      loading: "جارٍ تحميل المنتجات...",
      noResults: "لا توجد منتجات",
      outOfStock: "غير متوفر",
      orderNow: "اطلب الآن",
      all: "الكل",
    },

    shipping: {
      title: "حاسبة الشحن",
      subtitle: "احصل على تقدير لتكلفة الشحن إلى موقعك. يتم تأكيد السعر النهائي عند الطلب.",
      country: "بلد الوجهة *",
      countryPlaceholder: "اكتب للبحث عن الدولة...",
      weight: "الوزن التقديري (كجم)",
      calculate: "احسب تكلفة الشحن ←",
      estimatesFor: "عرض التقديرات لـ",
      methods: {
        courier: { label: "شحن سريع", desc: "DHL / FedEx / أرامكس" },
        air: { label: "شحن جوي", desc: "شحن جوي عادي" },
        sea: { label: "شحن بحري", desc: "شحن بحري اقتصادي" },
      },
      warning: "هذه تقديرات فقط. تعتمد تكلفة الشحن النهائية على أبعاد الطرد الفعلية والوزن وأسعار الناقل وقت الشحن. سنؤكد التكلفة الدقيقة عبر واتساب قبل الدفع.",
      noData: "لا تتوفر لدينا تقديرات شحن لهذا البلد. يرجى التواصل معنا عبر واتساب للحصول على عرض سعر مخصص.",
    },

    form: {
      title: "قدّم طلبك",
      subtitle: "أدخل بياناتك وسنؤكد طلبك عبر واتساب",
      fullName: "الاسم الكامل *",
      fullNamePlaceholder: "اسمك الكامل",
      email: "البريد الإلكتروني *",
      emailPlaceholder: "you@email.com",
      phone: "الهاتف / واتساب *",
      phonePlaceholder: "50 000 0000",
      country: "الدولة *",
      countryPlaceholder: "اكتب للبحث عن الدولة...",
      product: "المنتج *",
      productPlaceholder: "— اختر منتجاً —",
      quantity: "الكمية *",
      payment: "طريقة الدفع *",
      paymentWise: "Wise",
      paymentWiseSub: "دولي",
      paymentBok: "بنك الخرطوم",
      paymentBokSub: "السودان",
      city: "المدينة *",
      cityPlaceholder: "مثال: دبي",
      notes: "ملاحظات إضافية",
      notesOptional: "(اختياري)",
      notesPlaceholder: "أي طلبات خاصة أو أسئلة أو تفاصيل...",
      subtotal: "إجمالي المنتجات",
      shippingNote: "الشحن غير مشمول.",
      shippingNoteDesc: "سيتم احتساب تكلفة الشحن النهائية بناءً على موقعك وإبلاغك عبر واتساب قبل الدفع. الإجمالي أعلاه يعكس سعر المنتج فقط.",
      terms: "أوافق على",
      termsLink: "الشروط والأحكام",
      termsRest: "، بما في ذلك سياسة الشحن وعملية الدفع اليدوي. أفهم أن طلبي يُؤكَّد فقط بعد التحقق من الدفع.",
      submit: "أرسل الطلب وافتح واتساب ←",
      submitting: "جارٍ الإرسال...",
      hint: "سيتم حفظ طلبك وفتح رسالة واتساب تلقائياً",
      noCountry: "لا توجد نتائج",
    },

    payment: {
      title: "تفاصيل الدفع",
      subtitle: "حوّل المبلغ المحدد إلى أحد الحسابات أدناه بعد تقديم طلبك",
      wise: { title: "Wise (موصى به)", sub: "دولي — يقبل معظم العملات" },
      bok: { title: "بنك الخرطوم", sub: "السودان — التحويلات المحلية" },
      fields: {
        accountName: "اسم الحساب",
        email: "البريد الإلكتروني",
        currency: "العملة",
        reference: "المرجع",
        accountNumber: "رقم الحساب",
        iban: "IBAN",
      },
    },

    proof: {
      title: "بعد التحويل، أرسل إثبات الدفع عبر واتساب",
      desc1: "التقط صورة من إيصال التحويل وأرسله إلينا عبر واتساب على الرقم",
      desc2: "أدرج اسمك الكامل والمنتج الذي طلبته. سنتحقق من دفعتك ونرسل لك فاتورة رسمية خلال 24 ساعة.",
    },

    footer: {
      rights: "© 2026 خدمات كوش التعليمية — الإمارات",
    },

    modal: {
      title: "تم استلام طلبك!",
      desc: "شكراً على طلبك. يرجى الآن تحويل المبلغ وإرسال الإيصال عبر واتساب إلى",
      desc2: "سنؤكد خلال 24 ساعة.",
      btn: "حسناً",
    },
  },
}
