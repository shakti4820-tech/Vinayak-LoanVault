import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CameraModal } from '../components/CameraModal';
import { createGoldJewelrySvg, createCustomerPhotoSvg } from '../assets/placeholders';
import { 
  PlusCircle, 
  Camera, 
  Upload, 
  CheckCircle, 
  Calculator, 
  User, 
  Coins, 
  ShieldCheck, 
  Printer,
  Sparkles
} from 'lucide-react';

export const NewLoan = ({ onNavigate, onOpenDocument }) => {
  const { addLoan, metalRates, customers } = useApp();

  // Auto generate new Loan ID & Member ID
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const autoLoanId = `GL-2026-${randomSuffix}`;
  const autoLoanNo = `2199000${randomSuffix}`;
  const autoMemberNo = `RVNL000${Math.floor(100 + Math.random() * 900)}`;

  // Customer Selection state
  const [selectedCustomerId, setSelectedCustomerId] = useState('new');
  
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [idProofType, setIdProofType] = useState('Aadhaar Card');
  const [idProofNo, setIdProofNo] = useState('');
  const [customerPhoto, setCustomerPhoto] = useState(createCustomerPhotoSvg('New Customer'));

  // Item details
  const [itemType, setItemType] = useState('Gold');
  const [itemName, setItemName] = useState('Gold Necklace');
  const [units, setUnits] = useState(1);
  const [grossWeight, setGrossWeight] = useState(25.0);
  const [deductions, setDeductions] = useState(0.0);
  const [purity, setPurity] = useState('22K');
  
  // Financials & Terms
  const [marketRate, setMarketRate] = useState(metalRates.gold22k || 6737);
  const [actualLoan, setActualLoan] = useState(120000);
  const [interestRate, setInterestRate] = useState(metalRates.defaultInterestRate || 22.0);
  const [tenureMonths, setTenureMonths] = useState(12);
  const [processingFees, setProcessingFees] = useState(1500);
  const [modeOfComputation, setModeOfComputation] = useState('Monthly Rest');
  const [notes, setNotes] = useState('Verified hallmark purity test.');

  // Photos
  const [photos, setPhotos] = useState({
    front: createGoldJewelrySvg('Pledged Item', purity, grossWeight, 'Front'),
    back: createGoldJewelrySvg('Pledged Item', purity, grossWeight, 'Back'),
    hallmark: createGoldJewelrySvg('Pledged Item', purity, grossWeight, 'Hallmark'),
    scale: createGoldJewelrySvg('Pledged Item', purity, grossWeight, 'Scale')
  });

  // Camera Modal State
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [targetPhotoKey, setTargetPhotoKey] = useState('front');

  // Handle Customer Selection Dropdown
  const handleCustomerSelect = (e) => {
    const val = e.target.value;
    setSelectedCustomerId(val);
    if (val !== 'new') {
      const c = customers.find(cust => cust.id === val);
      if (c) {
        setCustomerName(c.name);
        setFatherName(c.fatherName || '');
        setMobile(c.mobile || '');
        setAddress(c.address || '');
        setIdProofType(c.idProofType || 'Aadhaar Card');
        setIdProofNo(c.idProofNo || '');
      }
    } else {
      setCustomerName('');
      setFatherName('');
      setMobile('');
      setAddress('');
      setIdProofNo('');
    }
  };

  // Update market rate automatically when metal or purity changes
  useEffect(() => {
    if (itemType === 'Gold') {
      if (purity === '24K') setMarketRate(metalRates.gold24k);
      else if (purity === '22K') setMarketRate(metalRates.gold22k);
      else if (purity === '20K') setMarketRate(metalRates.gold20k || 6125);
      else if (purity === '18K') setMarketRate(metalRates.gold18k);
    } else {
      setMarketRate(metalRates.silver999);
      setPurity('925 Silver');
    }
  }, [itemType, purity, metalRates]);

  // Derived Calculations
  const netWeight = Math.max(0, grossWeight - deductions);
  const marketValue = Math.round(netWeight * marketRate);
  const ltvPct = itemType === 'Gold' ? metalRates.goldLtv : metalRates.silverLtv;
  const eligibleAmount = Math.round(marketValue * (ltvPct / 100));

  // Auto-set actual loan to eligible amount initially when weight changes
  useEffect(() => {
    setActualLoan(eligibleAmount);
  }, [eligibleAmount]);

  const emiAmount = Math.round((actualLoan * (interestRate / 100)) / 12);

  const handleOpenCamera = (photoKey) => {
    setTargetPhotoKey(photoKey);
    setCameraModalOpen(true);
  };

  const handleCapturedPhoto = (dataUrl) => {
    if (targetPhotoKey === 'customer') {
      setCustomerPhoto(dataUrl);
    } else {
      setPhotos(prev => ({ ...prev, [targetPhotoKey]: dataUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const todayStr = new Date().toISOString().slice(0, 10);
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + Number(tenureMonths));
    const dueDateStr = dueDate.toISOString().slice(0, 10);

    const firstEmi = new Date();
    firstEmi.setMonth(firstEmi.getMonth() + 1);
    const firstEmiStr = firstEmi.toISOString().slice(0, 10).split('-').reverse().join('/');

    const newLoanObj = {
      id: autoLoanId,
      loanNo: autoLoanNo,
      memberNo: selectedCustomerId !== 'new' ? selectedCustomerId : autoMemberNo,
      customerName,
      fatherName,
      mobile,
      address,
      idProofType,
      idProofNo,
      customerPhoto,
      
      itemType,
      itemName,
      units: Number(units),
      grossWeight: Number(grossWeight),
      deductions: Number(deductions),
      netWeight,
      purity,
      purityWeight: (netWeight * (purity === '24K' ? 0.999 : purity === '22K' ? 0.916 : 0.833)).toFixed(1),
      marketRate,
      marketValue,
      
      eligibleAmount,
      loanAmount: Number(actualLoan),
      interestRate: Number(interestRate),
      tenureMonths: Number(tenureMonths),
      modeOfComputation,
      
      loanDate: todayStr,
      dueDate: dueDateStr,
      firstEmiDate: firstEmiStr,
      emiAmount,
      processingFees: Number(processingFees),
      insurancePremium: 0,
      status: 'Active',
      notes,
      photos
    };

    addLoan(newLoanObj);
    alert(`🎉 Loan Sanctioned Successfully! Loan ID: ${autoLoanId}`);
    onOpenDocument(newLoanObj);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="font-cinzel gold-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            NEW LOAN ENTRY FORM
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Sanction a new gold or silver pledge loan & generate official document slips
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div className="badge badge-gold" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
            Generated ID: {autoLoanId}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* SECTION 1: CUSTOMER SELECTION & DETAILS */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid rgba(229,184,105,0.2)', paddingBottom: '0.8rem' }}>
            <h3 className="gold-text" style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} /> 1. Customer Information
            </h3>
            
            {/* Existing Customer Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Select Customer:</span>
              <select className="form-control" value={selectedCustomerId} onChange={handleCustomerSelect} style={{ width: '220px', padding: '0.4rem 0.8rem' }}>
                <option value="new">+ Add New Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.mobile})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Customer Full Name *</label>
              <input type="text" className="form-control" placeholder="e.g. Rahul Sharma" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Father's / Husband's Name</label>
              <input type="text" className="form-control" placeholder="e.g. Ramesh Sharma" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Mobile Number *</label>
              <input type="tel" className="form-control" placeholder="e.g. 9829012345" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>ID Proof Type & Number</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select className="form-control" value={idProofType} onChange={(e) => setIdProofType(e.target.value)} style={{ width: '120px' }}>
                  <option value="Aadhaar Card">Aadhaar</option>
                  <option value="PAN Card">PAN</option>
                  <option value="Voter ID">Voter ID</option>
                </select>
                <input type="text" className="form-control" placeholder="ID Number" value={idProofNo} onChange={(e) => setIdProofNo(e.target.value)} />
              </div>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Full Address *</label>
              <input type="text" className="form-control" placeholder="House No, Street, City, Pincode" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
          </div>
        </div>

        {/* SECTION 2: PLEDGED ITEM SPECIFICATIONS */}
        <div className="glass-card">
          <h3 className="gold-text" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', borderBottom: '1px solid rgba(229,184,105,0.2)', paddingBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Coins size={18} /> 2. Pledged Item Specifications & Weight
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Metal Type</label>
              <select className="form-control" value={itemType} onChange={(e) => setItemType(e.target.value)}>
                <option value="Gold">Gold 🪙</option>
                <option value="Silver">Silver 🥈</option>
              </select>
            </div>

            <div className="form-group">
              <label>Item Category / Name</label>
              <input type="text" className="form-control" placeholder="e.g. Gold Necklace, Bangles, Ring" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Quantity / Units</label>
              <input type="number" className="form-control" value={units} onChange={(e) => setUnits(e.target.value)} min="1" required />
            </div>

            <div className="form-group">
              <label>Gross Weight (Grams)</label>
              <input type="number" step="0.01" className="form-control" value={grossWeight} onChange={(e) => setGrossWeight(Number(e.target.value))} required />
            </div>

            <div className="form-group">
              <label>Stones / Deduction (Grams)</label>
              <input type="number" step="0.01" className="form-control" value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} />
            </div>

            <div className="form-group">
              <label>Net Purity Weight (Grams)</label>
              <input type="text" className="form-control" value={`${netWeight.toFixed(2)} g`} readOnly style={{ background: 'rgba(229,184,105,0.1)', color: '#f5d78a', fontWeight: 700 }} />
            </div>

            <div className="form-group">
              <label>Metal Purity Rating</label>
              {itemType === 'Gold' ? (
                <select className="form-control" value={purity} onChange={(e) => setPurity(e.target.value)}>
                  <option value="24K">24K Pure Gold (99.9%)</option>
                  <option value="22K">22K Hallmark (91.6%)</option>
                  <option value="20K">20K Gold (83.3%)</option>
                  <option value="18K">18K Gold (75.0%)</option>
                </select>
              ) : (
                <select className="form-control" value={purity} onChange={(e) => setPurity(e.target.value)}>
                  <option value="925 Silver">925 Silver (92.5%)</option>
                  <option value="999 Fine Silver">999 Fine Silver (99.9%)</option>
                </select>
              )}
            </div>

            <div className="form-group">
              <label>Current Metal Rate (₹/g)</label>
              <input type="number" className="form-control" value={marketRate} onChange={(e) => setMarketRate(Number(e.target.value))} required />
            </div>
          </div>
        </div>

        {/* SECTION 3: VALUATION & LOAN SANCTION CALCULATOR */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(24,27,38,0.95) 0%, rgba(18,20,28,0.95) 100%)', border: '1px solid var(--gold-primary)' }}>
          <h3 className="gold-text" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calculator size={18} /> 3. Automatic Valuation & Loan Limits
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(10,11,14,0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Gross Market Valuation</span>
              <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', fontWeight: 800 }}>₹{marketValue.toLocaleString('en-IN')}</h3>
            </div>

            <div style={{ background: 'rgba(10,11,14,0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(229,184,105,0.3)' }}>
              <span style={{ fontSize: '0.75rem', color: '#e5b869', textTransform: 'uppercase' }}>Max Eligible Loan ({ltvPct}% LTV)</span>
              <h3 className="gold-text" style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹{eligibleAmount.toLocaleString('en-IN')}</h3>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ color: '#f5d78a' }}>Actual Loan Given (₹) *</label>
              <input 
                type="number" 
                className="form-control" 
                value={actualLoan} 
                onChange={(e) => setActualLoan(Number(e.target.value))} 
                style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f5d78a', border: '1px solid var(--gold-primary)' }} 
                required 
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>Interest Rate (% p.a)</label>
              <input type="number" step="0.1" className="form-control" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} required />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>Tenure (Months)</label>
              <input type="number" className="form-control" value={tenureMonths} onChange={(e) => setTenureMonths(Number(e.target.value))} required />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>Processing Fees (₹)</label>
              <input type="number" className="form-control" value={processingFees} onChange={(e) => setProcessingFees(Number(e.target.value))} />
            </div>
          </div>

          {actualLoan > eligibleAmount && (
            <div style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid rgba(239,68,68,0.3)' }}>
              ⚠️ Note: Actual Loan Given (₹{actualLoan.toLocaleString()}) exceeds standard LTV limit (₹{eligibleAmount.toLocaleString()}). Requires Manager Approval.
            </div>
          )}
        </div>

        {/* SECTION 4: ITEM & CUSTOMER PHOTO CAPTURE / UPLOAD */}
        <div className="glass-card">
          <h3 className="gold-text" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={18} /> 4. Mandatory Photo Documentation 📸
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {/* Customer Photo */}
            <div style={{ textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e5b869', marginBottom: '0.5rem' }}>Customer Profile</div>
              <img src={customerPhoto} alt="Customer" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }} />
              <button type="button" onClick={() => handleOpenCamera('customer')} className="btn-secondary" style={{ width: '100%', fontSize: '0.75rem', padding: '0.3rem' }}>
                <Camera size={13} /> Snap Photo
              </button>
            </div>

            {/* Front Photo */}
            <div style={{ textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e5b869', marginBottom: '0.5rem' }}>Front Photo</div>
              <img src={photos.front} alt="Front" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }} />
              <button type="button" onClick={() => handleOpenCamera('front')} className="btn-secondary" style={{ width: '100%', fontSize: '0.75rem', padding: '0.3rem' }}>
                <Camera size={13} /> Snap Photo
              </button>
            </div>

            {/* Back Photo */}
            <div style={{ textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e5b869', marginBottom: '0.5rem' }}>Back Photo</div>
              <img src={photos.back} alt="Back" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }} />
              <button type="button" onClick={() => handleOpenCamera('back')} className="btn-secondary" style={{ width: '100%', fontSize: '0.75rem', padding: '0.3rem' }}>
                <Camera size={13} /> Snap Photo
              </button>
            </div>

            {/* Hallmark Photo */}
            <div style={{ textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e5b869', marginBottom: '0.5rem' }}>Hallmark Stamp</div>
              <img src={photos.hallmark} alt="Hallmark" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }} />
              <button type="button" onClick={() => handleOpenCamera('hallmark')} className="btn-secondary" style={{ width: '100%', fontSize: '0.75rem', padding: '0.3rem' }}>
                <Camera size={13} /> Snap Photo
              </button>
            </div>

            {/* Weight Scale Photo */}
            <div style={{ textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e5b869', marginBottom: '0.5rem' }}>Weight Scale</div>
              <img src={photos.scale} alt="Scale" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem' }} />
              <button type="button" onClick={() => handleOpenCamera('scale')} className="btn-secondary" style={{ width: '100%', fontSize: '0.75rem', padding: '0.3rem' }}>
                <Camera size={13} /> Snap Photo
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 5: NOTES & SUBMIT */}
        <div className="glass-card">
          <div className="form-group">
            <label>Inspection Notes & Title Chain Details</label>
            <input type="text" className="form-control" placeholder="e.g. Original purchase bill verified, 22K hallmark stamp confirmed" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={() => onNavigate('dashboard')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-gold" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}>
              <CheckCircle size={18} /> Sanction Loan & Generate Slips 🧾
            </button>
          </div>
        </div>
      </form>

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCapture={handleCapturedPhoto}
        title={`Capture ${targetPhotoKey.toUpperCase()} View`}
      />
    </div>
  );
};
