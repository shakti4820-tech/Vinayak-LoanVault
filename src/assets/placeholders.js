// Dynamic realistic SVG Data URLs for Gold & Silver Jewellery and Customer Avatars (Synthetic Demo Assets)

export const createGoldJewelrySvg = (title, purity, weight, type = 'Front') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
    <rect width="600" height="450" fill="#14161f"/>
    <radialGradient id="g1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f7e096" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.8"/>
    </radialGradient>
    <rect width="600" height="450" fill="url(#g1)"/>
    
    <!-- Gold Metallic Gradients -->
    <linearGradient id="goldMat" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe89c"/>
      <stop offset="30%" stop-color="#e5b869"/>
      <stop offset="70%" stop-color="#b8860b"/>
      <stop offset="100%" stop-color="#8a6100"/>
    </linearGradient>
    
    <!-- Border Frame -->
    <rect x="15" y="15" width="570" height="420" fill="none" stroke="#e5b869" stroke-width="1.5" stroke-dasharray="8 4" opacity="0.4"/>
    
    <!-- Item Graphic Shapes -->
    <g transform="translate(300, 200)" align="center">
      ${type === 'Hallmark' ? `
        <!-- Hallmark Stamp Visual -->
        <rect x="-80" y="-50" width="160" height="100" rx="10" fill="url(#goldMat)" stroke="#fff" stroke-width="2"/>
        <text x="0" y="-10" font-family="Arial, sans-serif" font-weight="bold" font-size="22" fill="#000" text-anchor="middle">BIS 916</text>
        <text x="0" y="20" font-family="Arial, sans-serif" font-weight="bold" font-size="16" fill="#4a3500" text-anchor="middle">HALLMARK</text>
        <circle cx="-50" cy="0" r="14" fill="#8a6100"/>
        <text x="-50" y="5" font-size="12" fill="#fff" text-anchor="middle">HUID</text>
      ` : type === 'Scale' ? `
        <!-- Weight Machine Reading -->
        <rect x="-130" y="-70" width="260" height="140" rx="12" fill="#0f172a" stroke="#e5b869" stroke-width="3"/>
        <rect x="-100" y="-45" width="200" height="55" rx="6" fill="#022c22" stroke="#059669" stroke-width="2"/>
        <text x="70" y="-8" font-family="monospace" font-weight="bold" font-size="34" fill="#34d399" text-anchor="end">${weight} g</text>
        <text x="0" y="45" font-family="Arial" font-size="14" fill="#94a3b8" text-anchor="middle">DIGITAL PRECISION SCALE</text>
      ` : `
        <!-- Necklace / Jewellery Art -->
        <path d="M -110,-60 Q 0,110 110,-60 Q 0,50 -110,-60 Z" fill="none" stroke="url(#goldMat)" stroke-width="16" stroke-linecap="round"/>
        <circle cx="0" cy="65" r="22" fill="url(#goldMat)"/>
        <circle cx="0" cy="65" r="12" fill="#991b1b"/>
        <circle cx="-50" cy="25" r="14" fill="url(#goldMat)"/>
        <circle cx="50" cy="25" r="14" fill="url(#goldMat)"/>
      `}
    </g>

    <!-- Watermark / Labels -->
    <rect x="25" y="375" width="550" height="50" rx="8" fill="rgba(10, 11, 14, 0.85)" stroke="#e5b869" stroke-width="1"/>
    <text x="40" y="405" font-family="'Plus Jakarta Sans', sans-serif" font-weight="bold" font-size="16" fill="#f5d78a">${title} (${type} View)</text>
    <text x="560" y="405" font-family="'Plus Jakarta Sans', sans-serif" font-weight="bold" font-size="14" fill="#cbd5e1" text-anchor="end">${purity} • ${weight}g</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const createCustomerPhotoSvg = (name) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="360" viewBox="0 0 300 360">
    <rect width="300" height="360" fill="#1e293b"/>
    <circle cx="150" cy="130" r="60" fill="#475569"/>
    <path d="M 50 300 C 50 210, 250 210, 250 300 Z" fill="#334155"/>
    <rect x="10" y="315" width="280" height="35" rx="6" fill="#0f172a" stroke="#e5b869" stroke-width="1"/>
    <text x="150" y="338" font-family="Arial, sans-serif" font-weight="bold" font-size="15" fill="#f5d78a" text-anchor="middle">${name}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const DEFAULT_CUSTOMERS_DEMO = [
  {
    id: "RVNL001001",
    name: "RAJESH KUMAR SHARMA",
    fatherName: "RAMESH CHAND SHARMA",
    mobile: "9876543210",
    address: "PLOT 12, MAHAVIR NAGAR, KUCHAMAN CITY-341509",
    idProofType: "Aadhaar Card",
    idProofNo: "XXXX-XXXX-1111",
    dateJoined: "2026-08-01"
  },
  {
    id: "RVNL001002",
    name: "ANITA DEVI PATEL",
    fatherName: "SURESH PATEL",
    mobile: "9876543211",
    address: "NEAR BUS STAND, KUCHAMAN CITY-341509",
    idProofType: "PAN Card",
    idProofNo: "ABCDE1234F",
    dateJoined: "2026-08-15"
  },
  {
    id: "RVNL001003",
    name: "VIKRAM SINGH RATHORE",
    fatherName: "GOPAL SINGH RATHORE",
    mobile: "9876543212",
    address: "STATION ROAD, NAGAUR-341001",
    idProofType: "Aadhaar Card",
    idProofNo: "XXXX-XXXX-2222",
    dateJoined: "2026-09-01"
  }
];

export const DEFAULT_PAYMENTS_DEMO = [
  {
    id: "PAY-1001",
    loanId: "GL-2026-1001",
    customerName: "RAJESH KUMAR SHARMA",
    date: "2026-09-14",
    amount: 3667,
    type: "Interest EMI",
    mode: "Cash / UPI",
    receiptNo: "REC-2026-101"
  },
  {
    id: "PAY-1002",
    loanId: "GL-2026-1002",
    customerName: "ANITA DEVI PATEL",
    date: "2026-08-19",
    amount: 2700,
    type: "Interest EMI",
    mode: "Cash / UPI",
    receiptNo: "REC-2026-102"
  }
];

export const DEFAULT_LOANS_DEMO = [
  {
    id: "GL-2026-1001",
    loanNo: "21990000101",
    memberNo: "RVNL001001",
    customerName: "RAJESH KUMAR SHARMA",
    fatherName: "RAMESH CHAND SHARMA",
    mobile: "9876543210",
    address: "PLOT 12, MAHAVIR NAGAR, KUCHAMAN CITY-341509",
    idProofType: "Aadhaar Card",
    idProofNo: "XXXX-XXXX-1111",
    customerPhoto: createCustomerPhotoSvg("RAJESH KUMAR SHARMA"),
    
    itemType: "Gold",
    itemName: "GOLD NECKLACE (DEMO)",
    category: "ORNAMENTS",
    units: 1,
    grossWeight: 25.0,
    deductions: 0.0,
    netWeight: 25.0,
    purity: "22K",
    purityWeight: 22.9,
    marketRate: 7200,
    marketValue: 270000,
    
    eligibleAmount: 202500,
    loanAmount: 200000,
    interestRate: 22.0,
    interestType: "p.a flat",
    tenureMonths: 12,
    modeOfComputation: "Monthly Rest",
    
    loanDate: "2026-08-15",
    dueDate: "2027-08-15",
    firstEmiDate: "2026-09-15",
    emiAmount: 3667.0,
    processingFees: 1500,
    insurancePremium: 0,
    status: "Active",
    notes: "Synthetic demo loan record. Verified hallmark 22K ornament placeholder.",
    
    photos: {
      front: createGoldJewelrySvg("Gold Necklace", "22K", 25.0, "Front"),
      back: createGoldJewelrySvg("Gold Necklace", "22K", 25.0, "Back"),
      hallmark: createGoldJewelrySvg("Gold Necklace", "22K", 25.0, "Hallmark"),
      scale: createGoldJewelrySvg("Gold Necklace", "22K", 25.0, "Scale")
    }
  },
  {
    id: "GL-2026-1002",
    loanNo: "21990000102",
    memberNo: "RVNL001002",
    customerName: "ANITA DEVI PATEL",
    fatherName: "SURESH PATEL",
    mobile: "9876543211",
    address: "NEAR BUS STAND, KUCHAMAN CITY-341509",
    idProofType: "PAN Card",
    idProofNo: "ABCDE1234F",
    customerPhoto: createCustomerPhotoSvg("ANITA DEVI PATEL"),
    
    itemType: "Gold",
    itemName: "GOLD BANGLES (4 PCS DEMO)",
    category: "ORNAMENTS",
    units: 4,
    grossWeight: 40.0,
    deductions: 2.0,
    netWeight: 38.0,
    purity: "22K",
    purityWeight: 34.8,
    marketRate: 7200,
    marketValue: 273600,
    
    eligibleAmount: 205200,
    loanAmount: 180000,
    interestRate: 18.0,
    interestType: "p.a flat",
    tenureMonths: 12,
    modeOfComputation: "Monthly Rest",
    
    loanDate: "2026-07-20",
    dueDate: "2027-07-20",
    firstEmiDate: "2026-08-20",
    emiAmount: 2700.0,
    processingFees: 1200,
    insurancePremium: 0,
    status: "Active",
    notes: "Synthetic demo loan record. Pledged solid gold bangles placeholder.",
    
    photos: {
      front: createGoldJewelrySvg("Gold Bangles", "22K", 38.0, "Front"),
      back: createGoldJewelrySvg("Gold Bangles", "22K", 38.0, "Back"),
      hallmark: createGoldJewelrySvg("Gold Bangles", "22K", 38.0, "Hallmark"),
      scale: createGoldJewelrySvg("Gold Bangles", "22K", 38.0, "Scale")
    }
  },
  {
    id: "SL-2026-0001",
    loanNo: "21990000103",
    memberNo: "RVNL001003",
    customerName: "VIKRAM SINGH RATHORE",
    fatherName: "GOPAL SINGH RATHORE",
    mobile: "9876543212",
    address: "STATION ROAD, NAGAUR-341001",
    idProofType: "Aadhaar Card",
    idProofNo: "XXXX-XXXX-2222",
    customerPhoto: createCustomerPhotoSvg("VIKRAM SINGH RATHORE"),
    
    itemType: "Silver",
    itemName: "SILVER ANKLETS (DEMO PAYAL)",
    category: "SILVERWARE",
    units: 2,
    grossWeight: 350.0,
    deductions: 10.0,
    netWeight: 340.0,
    purity: "925 Silver",
    purityWeight: 314.5,
    marketRate: 92,
    marketValue: 31280,
    
    eligibleAmount: 23460,
    loanAmount: 20000,
    interestRate: 24.0,
    interestType: "p.a flat",
    tenureMonths: 6,
    modeOfComputation: "Monthly Rest",
    
    loanDate: "2026-09-01",
    dueDate: "2027-03-01",
    firstEmiDate: "2026-10-01",
    emiAmount: 3733.0,
    processingFees: 500,
    insurancePremium: 0,
    status: "Active",
    notes: "Synthetic demo loan record. Heavy silver payal placeholder.",
    
    photos: {
      front: createGoldJewelrySvg("Silver Anklets", "925 Silver", 340.0, "Front"),
      back: createGoldJewelrySvg("Silver Anklets", "925 Silver", 340.0, "Back"),
      hallmark: createGoldJewelrySvg("Silver Anklets", "925 Silver", 340.0, "Hallmark"),
      scale: createGoldJewelrySvg("Silver Anklets", "925 Silver", 340.0, "Scale")
    }
  },
  {
    id: "GL-2025-0500",
    loanNo: "21990000099",
    memberNo: "RVNL001001",
    customerName: "RAJESH KUMAR SHARMA",
    fatherName: "RAMESH CHAND SHARMA",
    mobile: "9876543210",
    address: "PLOT 12, MAHAVIR NAGAR, KUCHAMAN CITY-341509",
    idProofType: "Aadhaar Card",
    idProofNo: "XXXX-XXXX-1111",
    customerPhoto: createCustomerPhotoSvg("RAJESH KUMAR SHARMA"),
    
    itemType: "Gold",
    itemName: "GOLD CHAIN 24K (DEMO)",
    category: "ORNAMENTS",
    units: 1,
    grossWeight: 15.0,
    deductions: 0.0,
    netWeight: 15.0,
    purity: "24K",
    purityWeight: 15.0,
    marketRate: 6800,
    marketValue: 102000,
    
    eligibleAmount: 76500,
    loanAmount: 70000,
    interestRate: 20.0,
    interestType: "p.a flat",
    tenureMonths: 6,
    modeOfComputation: "Monthly Rest",
    
    loanDate: "2025-08-10",
    dueDate: "2026-02-10",
    closedDate: "2026-02-10",
    firstEmiDate: "2025-09-10",
    emiAmount: 2333.0,
    processingFees: 800,
    insurancePremium: 0,
    status: "Closed",
    notes: "Synthetic closed loan record. All EMIs paid in full. Pledged ornament returned.",
    
    photos: {
      front: createGoldJewelrySvg("Gold Chain", "24K", 15.0, "Front"),
      back: createGoldJewelrySvg("Gold Chain", "24K", 15.0, "Back"),
      hallmark: createGoldJewelrySvg("Gold Chain", "24K", 15.0, "Hallmark"),
      scale: createGoldJewelrySvg("Gold Chain", "24K", 15.0, "Scale")
    }
  }
];
