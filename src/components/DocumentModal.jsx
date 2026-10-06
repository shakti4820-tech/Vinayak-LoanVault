import React, { useState, useRef } from 'react';
import { X, Printer, Download, FileText, CheckCircle, Image as ImageIcon } from 'lucide-react';
import officialLogoFull from '../assets/official_logo_full.png';
import html2pdf from 'html2pdf.js';

export const DocumentModal = ({ isOpen, onClose, loan }) => {
  const [activeDocType, setActiveDocType] = useState('sanction-letter'); // 'sanction-letter' | 'sanction-note' | 'welcome-letter' | 'repayment-schedule'
  const printRef = useRef(null);

  if (!isOpen || !loan) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const element = printRef.current;
    const opt = {
      margin: 8,
      filename: `${loan.id}_${activeDocType}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  // Generate repayment schedule rows
  const generateRepaymentSchedule = () => {
    const rows = [];
    const monthlyInterestRate = (loan.interestRate || 22) / 12 / 100;
    const monthlyInterestAmt = Math.round(loan.loanAmount * monthlyInterestRate);
    const emi = loan.emiAmount || Math.round(monthlyInterestAmt);

    const startDate = new Date(loan.loanDate || '2026-09-19');

    for (let i = 1; i <= (loan.tenureMonths || 12); i++) {
      const instDate = new Date(startDate);
      instDate.setMonth(instDate.getMonth() + i);
      const formattedDate = instDate.toISOString().slice(0, 10).split('-').reverse().join('/');

      rows.push({
        instNo: i,
        instDate: formattedDate,
        installment: emi,
        principle: 0,
        interest: monthlyInterestAmt,
        posBalance: loan.loanAmount,
        penalty: '',
        paidAmount: ''
      });
    }
    return rows;
  };

  const repaymentRows = generateRepaymentSchedule();

  return (
    <div className="no-print-bg" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2500,
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '900px',
        maxHeight: '92vh',
        background: '#12141c',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden'
      }}>
        {/* Top Action Bar */}
        <div className="no-print" style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid rgba(229,184,105,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#181b26'
        }}>
          {/* Document Selectors */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveDocType('sanction-letter')}
              className={activeDocType === 'sanction-letter' ? 'btn-gold' : 'btn-secondary'}
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
            >
              📜 Sanction Letter / Slip
            </button>
            <button
              onClick={() => setActiveDocType('sanction-note')}
              className={activeDocType === 'sanction-note' ? 'btn-gold' : 'btn-secondary'}
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
            >
              📄 Sanction Note
            </button>
            <button
              onClick={() => setActiveDocType('welcome-letter')}
              className={activeDocType === 'welcome-letter' ? 'btn-gold' : 'btn-secondary'}
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
            >
              ✉️ Welcome Letter
            </button>
            <button
              onClick={() => setActiveDocType('repayment-schedule')}
              className={activeDocType === 'repayment-schedule' ? 'btn-gold' : 'btn-secondary'}
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
            >
              📅 Repayment Schedule
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button onClick={handlePrint} className="btn-gold" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>
              <Printer size={15} /> Print Slip
            </button>
            <button onClick={handleDownloadPdf} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}>
              <Download size={15} /> Download PDF
            </button>
            <button onClick={onClose} className="btn-secondary" style={{ padding: '0.4rem' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Viewport Container (White A4 page style) */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          background: '#2a2e3d',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div 
            id="printable-document" 
            ref={printRef}
            style={{
              width: '210mm',
              minHeight: '297mm',
              background: '#ffffff',
              color: '#000000',
              padding: '15mm',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              fontFamily: 'Arial, sans-serif',
              fontSize: '11px',
              lineHeight: '1.4'
            }}
          >
            {/* Header section common to all documents with official brand header */}
            <div style={{ textAlign: 'center', borderBottom: '3px solid #dc2626', paddingBottom: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginBottom: '4px' }}>
                <img src={officialLogoFull} alt="Vinayak Benefit Nidhi Ltd." style={{ height: '52px', width: 'auto', objectFit: 'contain' }} />
              </div>
              <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: '4px 0 0 0', textTransform: 'uppercase', color: '#1e3a8a' }}>
                VINAYAK BENEFIT NIDHI LTD.
              </h2>
              <div style={{ fontSize: '10px', color: '#333', marginTop: '2px' }}>
                J.K. PLAZA, KUMAWAT COMPLEX KE PASS, KUCHAMAN CITY, NAGAUR (RJ) 341509<br />
                <strong>CIN : U65990RJ2022PLN083831 • Government Registered Nidhi Company</strong>
              </div>
            </div>

            {/* DOCUMENT TYPE 1: GOLD/SILVER LOAN FORM - SANCTION LETTER */}
            {activeDocType === 'sanction-letter' && (
              <div>
                <div style={{ textAlignment: 'center', textAlign: 'center', margin: '10px 0 15px 0' }}>
                  <h3 style={{ textDecoration: 'underline', fontSize: '13px', fontWeight: 'bold', margin: 0 }}>
                    GOLD/SILVER LOAN FORM - SANCTION LETTER
                  </h3>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '10px' }}>
                  <div>Sanction Date: <strong>{loan.loanDate}</strong></div>
                  <div>KUCHAMAN Nagaur RJ 341509 IN</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '10px' }}>
                  <div>Customer ID: <strong>{loan.loanNo || loan.id}</strong></div>
                  <div>CIN : U65990RJ2022PLN083831</div>
                </div>

                {/* Customer Details Box with Photos */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px' }}>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '8px', verticalAlign: 'top', width: '55%' }}>
                        <strong style={{ fontSize: '11px', textDecoration: 'underline' }}>Customer Details</strong><br /><br />
                        <strong>Name Address:</strong><br />
                        {loan.customerName}<br />
                        S/O {loan.fatherName || 'BHANWAR LAL'}<br />
                        {loan.address}<br />
                        Contact No: {loan.mobile}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '22%' }}>
                        <div style={{ fontSize: '9px', fontWeight: 'bold', marginBottom: '4px' }}>Customer Photo</div>
                        <img src={loan.customerPhoto} alt="Customer" style={{ width: '90px', height: '100px', objectFit: 'cover', border: '1px solid #ccc' }} />
                      </td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', width: '23%' }}>
                        <div style={{ fontSize: '9px', fontWeight: 'bold', marginBottom: '4px' }}>Pledged Item Photo</div>
                        <img src={loan.photos?.front || loan.photos?.scale} alt="Item" style={{ width: '100px', height: '100px', objectFit: 'contain', border: '1px solid #ccc' }} />
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Purpose and Parameters */}
                <div style={{ fontSize: '12px', fontWeight: 'bold', margin: '10px 0 6px 0' }}>
                  Purpose: {loan.itemType?.toUpperCase()} LOAN
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px' }}>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '5px', width: '25%' }}><strong>Loan Amount (Rs.):</strong> {loan.loanAmount}.0</td>
                      <td style={{ border: '1px solid #000', padding: '5px', width: '75%' }}><strong>In Words:</strong> Rupees {loan.loanAmount} Only</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '5px' }}><strong>Period of Loan:</strong> {loan.tenureMonths || 12.0} Months</td>
                      <td style={{ border: '1px solid #000', padding: '5px' }}><strong>Rate of Interest:</strong> {loan.interestRate}% p.a</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #000', padding: '5px' }}><strong>Mode of Computation:</strong> {loan.modeOfComputation || 'Monthly Rest'}</td>
                      <td style={{ border: '1px solid #000', padding: '5px' }}><strong>Loan Date:</strong> {loan.loanDate}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Pledged Details Table */}
                <div style={{ fontWeight: 'bold', fontSize: '11px', textAlign: 'center', background: '#f0f0f0', border: '1px solid #000', borderBottom: 'none', padding: '4px' }}>
                  Pledged Details
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
                  <thead>
                    <tr style={{ background: '#f9f9f9', textAlign: 'center' }}>
                      <th style={{ border: '1px solid #000', padding: '5px' }}>Category</th>
                      <th style={{ border: '1px solid #000', padding: '5px' }}>Units</th>
                      <th style={{ border: '1px solid #000', padding: '5px' }}>Gross Weight (gm)</th>
                      <th style={{ border: '1px solid #000', padding: '5px' }}>Deductions</th>
                      <th style={{ border: '1px solid #000', padding: '5px' }}>Net Weight</th>
                      <th style={{ border: '1px solid #000', padding: '5px' }}>Eligible Loan Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ textAlign: 'center' }}>
                      <td style={{ border: '1px solid #000', padding: '6px' }}>{loan.itemName || 'ORNAMENTS'}</td>
                      <td style={{ border: '1px solid #000', padding: '6px' }}>{loan.units || 1}</td>
                      <td style={{ border: '1px solid #000', padding: '6px' }}>{loan.grossWeight}</td>
                      <td style={{ border: '1px solid #000', padding: '6px' }}>{loan.deductions || 0}</td>
                      <td style={{ border: '1px solid #000', padding: '6px' }}>{loan.netWeight}</td>
                      <td style={{ border: '1px solid #000', padding: '6px' }}>₹{loan.eligibleAmount || loan.marketValue}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Terms Declaration */}
                <p style={{ fontSize: '9px', textAlign: 'justify', marginBottom: '35px', lineHeight: '1.3' }}>
                  I acknowledge having received the detailed terms and conditions relating to the above gold loan sanction and send to me through web link to my registered mobile number and I confirm having agreed to the same and signed digitally through an OTP. Actual interest, valuation, KYC requirements, loan limits, receipts, and legal wording follow the rules applicable to Riddhi Vinayak Benifit Nidhi Ltd.
                </p>

                {/* Signatures */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px', padding: '0 10px' }}>
                  <div>
                    <div style={{ borderTop: '1px solid #000', width: '180px', textAlign: 'center', paddingTop: '4px' }}>
                      <strong>Signature of the Customer:</strong>
                    </div>
                  </div>
                  <div>
                    <div style={{ borderTop: '1px solid #000', width: '180px', textAlign: 'center', paddingTop: '4px' }}>
                      <strong>Signature of the Branch Manager:</strong>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', fontSize: '9px' }}>
                  <strong>Branch Seal:</strong>
                </div>
              </div>
            )}

            {/* DOCUMENT TYPE 2: SANCTION NOTE */}
            {activeDocType === 'sanction-note' && (
              <div>
                <div style={{ textAlign: 'center', margin: '10px 0 15px 0' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: 0 }}>
                    SANCTION NOTE ________ Secure Loan
                  </h3>
                </div>

                <div style={{ fontSize: '10px', marginBottom: '12px' }}>
                  <strong>{loan.customerName} / {loan.fatherName || 'BHANWAR LAL'}</strong><br />
                  Address: {loan.address}<br />
                  Contact No. {loan.mobile}<br />
                  Loan No. <strong>{loan.loanNo || loan.id}</strong><br />
                  Loan Amount Rs. <strong>{loan.loanAmount}.0 /-</strong>
                </div>

                <p style={{ fontSize: '10px', marginBottom: '10px' }}>
                  Sir,<br />
                  We are in Receipt of a loan application form for the above named for Sanction of a loan for <strong>Rs. {loan.loanAmount}.0 /-</strong><br />
                  The Particular Request of the Request are as under :
                </p>

                <ul style={{ listStyleType: 'none', paddingLeft: 0, fontSize: '10px', lineHeight: '1.6', marginBottom: '15px' }}>
                  <li>- <strong>Loan Approval Date :</strong> {loan.loanDate}</li>
                  <li>- <strong>Amount Of Loan Rs.</strong> {loan.loanAmount}.0 /-</li>
                  <li>- <strong>Rate Of Interest to be Charged @</strong> {loan.interestRate} % P.M flat @Rs.</li>
                  <li>- <strong>Penalty/Overdue Charges 0.0 %</strong> , Charges EMI Rs. {loan.emiAmount || 4657}.0 /- No. {loan.tenureMonths || 12}.0</li>
                </ul>

                <div style={{ fontSize: '10px', marginBottom: '10px' }}>
                  <strong>Details Of the guarantor and co borrower</strong><br />
                  Guarantor / Add :-<br />
                  Keep in the view of the above details, We are of the opinion that a loan of Rs.{loan.loanAmount}.0<br />
                  Sanctioned to <strong>{loan.customerName} / {loan.fatherName || 'BHANWAR LAL'}</strong><br />
                  Payable in {loan.tenureMonths || 12}.0 No. of installment of Rs. {loan.emiAmount || 4657}.0/- Starting from {loan.firstEmiDate || '19/10/2026'}<br />
                  <strong>Document Required To Be Obtained :-</strong><br />
                  Original title along With entire Chain Document.<br />
                  Remark
                </div>

                {/* Company Payment Details Table */}
                <div style={{ border: '1px solid #000', marginTop: '15px' }}>
                  <div style={{ textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #000', padding: '4px', background: '#f0f0f0' }}>
                    PAYMENT DETAIL OF THE COMPANY
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ borderRight: '1px solid #000', padding: '4px', width: '40%' }}>Bank Name:</td>
                        <td style={{ borderRight: '1px solid #000', padding: '4px', width: '20%' }}>Amount (Rs.):</td>
                        <td style={{ borderRight: '1px solid #000', padding: '4px', width: '25%' }}>CHEQUE/NEFT/RTGS No.</td>
                        <td style={{ padding: '4px', width: '15%' }}>Date:</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Receipt Detail of Applicant */}
                <div style={{ border: '1px solid #000', marginTop: '12px', marginBottom: '35px' }}>
                  <div style={{ textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #000', padding: '4px', background: '#f0f0f0' }}>
                    RECEIPT DETAIL OF THE APPLICANT
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ borderRight: '1px solid #000', padding: '4px', width: '30%' }}>Bank Name :</td>
                        <td style={{ borderRight: '1px solid #000', padding: '4px', width: '30%' }}>Branch :</td>
                        <td style={{ borderRight: '1px solid #000', padding: '4px', width: '20%' }}>Account No. :</td>
                        <td style={{ padding: '4px', width: '20%' }}>Amount (Rs.) :</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Signatures Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', marginTop: '50px' }}>
                  <div><strong>Applicant</strong></div>
                  <div><strong>Co-Applicant</strong></div>
                  <div><strong>Guarantor</strong></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', marginTop: '50px' }}>
                  <div><strong>Manager</strong></div>
                  <div><strong>Director</strong></div>
                  <div><strong>Managing Director</strong></div>
                </div>
              </div>
            )}

            {/* DOCUMENT TYPE 3: WELCOME LETTER */}
            {activeDocType === 'welcome-letter' && (
              <div>
                <div style={{ textAlign: 'center', margin: '10px 0 15px 0' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, textDecoration: 'underline' }}>
                    Welcome Letter
                  </h3>
                </div>

                <div style={{ fontSize: '11px', marginBottom: '15px' }}>
                  <strong style={{ fontSize: '12px' }}>{loan.customerName}</strong><br />
                  S/O {loan.fatherName || 'BHANWAR LAL'}<br />
                  {loan.address}<br />
                  {loan.mobile}
                </div>

                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}>
                  Loan Account Number: {loan.loanNo || loan.id} and Member No. :{loan.memberNo || 'RVNL0000334'}
                </div>

                <p style={{ fontSize: '10px', marginBottom: '12px' }}>
                  Dear {loan.customerName}, At the outset we thank you for choosing Riddhi Vinayak Benifit Nidhi Ltd for your Secure Loan Requirement.
                </p>

                <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>
                  Details of your Secure Loan Account are as follows:
                </div>

                <table style={{ width: '100%', fontSize: '10px', marginBottom: '15px', lineHeight: '1.6' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '40%' }}>Loan Amount Sanctioned</td>
                      <td>: Rs. {loan.loanAmount}.0</td>
                    </tr>
                    <tr>
                      <td>Account Open Date</td>
                      <td>: Date {loan.loanDate}</td>
                    </tr>
                    <tr>
                      <td>Loan Amount Disbursed</td>
                      <td>: Rs. {loan.loanAmount}.0</td>
                    </tr>
                    <tr>
                      <td colSpan="2"><strong>Deductions</strong></td>
                    </tr>
                    <tr>
                      <td style={{ paddingLeft: '15px' }}>1) Loan Processing Fees</td>
                      <td>: Rs. {loan.processingFees || 1600}</td>
                    </tr>
                    <tr>
                      <td style={{ paddingLeft: '15px' }}>2) Insurance Premium</td>
                      <td>: Rs. {loan.insurancePremium || 0}</td>
                    </tr>
                    <tr>
                      <td>Net Amount Disbursed</td>
                      <td>: Rs. {loan.loanAmount - (loan.processingFees || 1600)}.0</td>
                    </tr>
                    <tr>
                      <td>Type of Interest Rate</td>
                      <td>: Flat</td>
                    </tr>
                    <tr>
                      <td>Term</td>
                      <td>: {loan.tenureMonths || 12}</td>
                    </tr>
                    <tr>
                      <td>Frequency</td>
                      <td>: Monthly</td>
                    </tr>
                    <tr>
                      <td>First EMI Date</td>
                      <td>: {loan.firstEmiDate || '19/10/2026'}</td>
                    </tr>
                    <tr>
                      <td>EMI Amount</td>
                      <td>: Rs. {loan.emiAmount || 4657}.0</td>
                    </tr>
                    <tr>
                      <td>Foreclosure charge</td>
                      <td>: 0% of Loan Amount</td>
                    </tr>
                  </tbody>
                </table>

                {/* Item Details Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0', textAlign: 'center' }}>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>S. No.</th>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>Item Name</th>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>Item Qty</th>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>Gross Weight</th>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>Net Weight</th>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>Purity Weight</th>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>Market Value</th>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ textAlign: 'center' }}>
                      <td style={{ border: '1px solid #000', padding: '4px' }}>1</td>
                      <td style={{ border: '1px solid #000', padding: '4px' }}>{loan.itemName || 'NECKLACE'}</td>
                      <td style={{ border: '1px solid #000', padding: '4px' }}>{loan.units || 1}</td>
                      <td style={{ border: '1px solid #000', padding: '4px' }}>{loan.grossWeight}</td>
                      <td style={{ border: '1px solid #000', padding: '4px' }}>{loan.netWeight}</td>
                      <td style={{ border: '1px solid #000', padding: '4px' }}>{loan.purityWeight || (loan.netWeight * 0.916).toFixed(1)}</td>
                      <td style={{ border: '1px solid #000', padding: '4px' }}>{loan.marketValue || 286200}</td>
                      <td style={{ border: '1px solid #000', padding: '4px' }}>{loan.notes || 'Verified'}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Item Image Attached to Welcome Letter */}
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', border: '1px solid #ccc', padding: '8px', marginBottom: '15px', borderRadius: '4px' }}>
                  <img src={loan.photos?.front || loan.photos?.scale} alt="Item" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                  <div style={{ fontSize: '9px' }}>
                    <strong>Pledged Asset Verification Photo</strong><br />
                    Item: {loan.itemName} ({loan.purity})<br />
                    Gross Weight: {loan.grossWeight}g | Vault Tag: #{loan.id}
                  </div>
                </div>

                <p style={{ fontSize: '8px', color: '#333', textAlign: 'justify', lineHeight: '1.2' }}>
                  Please note as per the terms and conditions of the loan executed between you and Riddhi Vinayak Benifit Nidhi Ltd, repayment of the loan will be through EMIs comprising principal and interest. The Riddhi Vinayak Benifit Nidhi Ltd reserves the right to recover all taxes, duties and levies under applicable laws as amended from time to time.
                </p>
              </div>
            )}

            {/* DOCUMENT TYPE 4: REPAYMENT SCHEDULE FOR LOANS */}
            {activeDocType === 'repayment-schedule' && (
              <div>
                <div style={{ textAlign: 'center', margin: '10px 0 15px 0' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 'bold', margin: 0, textDecoration: 'underline' }}>
                    Repayment Schedule for Loans
                  </h3>
                </div>

                <table style={{ width: '100%', fontSize: '10px', marginBottom: '12px' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '20%' }}><strong>Member No.</strong></td>
                      <td style={{ width: '30%' }}>: {loan.memberNo || 'RVNL0000334'}</td>
                      <td style={{ width: '20%' }}><strong>Member Name</strong></td>
                      <td style={{ width: '30%' }}>: {loan.customerName}</td>
                    </tr>
                    <tr>
                      <td><strong>Loan Type</strong></td>
                      <td>: Secure Loan ({loan.itemType})</td>
                      <td><strong>Loan Account No</strong></td>
                      <td>: {loan.loanNo || loan.id}</td>
                    </tr>
                    <tr>
                      <td><strong>Loan Date</strong></td>
                      <td>: {loan.loanDate}</td>
                      <td><strong>No of Inst.</strong></td>
                      <td>: {loan.tenureMonths || 12}</td>
                    </tr>
                    <tr>
                      <td><strong>First Emi Date</strong></td>
                      <td>: {loan.firstEmiDate || '19/10/2026'}</td>
                      <td><strong>Loan Amount</strong></td>
                      <td>: {loan.loanAmount}.0</td>
                    </tr>
                  </tbody>
                </table>

                {/* Repayment Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px' }}>
                  <thead>
                    <tr style={{ background: '#f0f0f0', textAlign: 'center' }}>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>Inst No</th>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>Inst Date</th>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>Installment</th>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>Principle</th>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>Interest</th>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>POS Balance</th>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>Penalty</th>
                      <th style={{ border: '1px solid #000', padding: '4px' }}>Paid Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repaymentRows.map((r) => (
                      <tr key={r.instNo} style={{ textAlign: 'center' }}>
                        <td style={{ border: '1px solid #000', padding: '3px' }}>{r.instNo}</td>
                        <td style={{ border: '1px solid #000', padding: '3px' }}>{r.instDate}</td>
                        <td style={{ border: '1px solid #000', padding: '3px' }}>{r.installment}.0</td>
                        <td style={{ border: '1px solid #000', padding: '3px' }}>{r.principle}</td>
                        <td style={{ border: '1px solid #000', padding: '3px' }}>{r.interest}</td>
                        <td style={{ border: '1px solid #000', padding: '3px' }}>-</td>
                        <td style={{ border: '1px solid #000', padding: '3px' }}>-</td>
                        <td style={{ border: '1px solid #000', padding: '3px' }}>-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Document Footer */}
            <div style={{ marginTop: '20px', borderTop: '1px dashed #ccc', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#666' }}>
              <span>riddhi.nidhi.in/SOFT/printFormat.xhtml</span>
              <span>Generated on {new Date().toLocaleDateString()}</span>
              <span>Page 1/1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
