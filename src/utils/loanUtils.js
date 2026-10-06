// Helper utilities for Loan EMI calculations, Customer 360 profiling, and Overdue Alert processing

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount || 0);
};

// Calculate exact monthly due dates from loan date
export const addMonthsToDate = (dateStr, months) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
};

// Calculate days difference between two YYYY-MM-DD dates
export const getDaysDiff = (dateStr1, dateStr2) => {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.ceil(diffTime / (1000 * 3600 * 24));
};

/**
 * Generate full EMI Repayment Schedule for a given Loan
 * Takes into account payments already recorded for this loan.
 */
export const getLoanEmiSchedule = (loan, payments = []) => {
  if (!loan) return [];

  const tenure = Number(loan.tenureMonths || 12);
  const startDate = loan.firstEmiDate || loan.loanDate || '2026-09-19';
  const emiAmount = Number(loan.emiAmount || Math.round((loan.loanAmount * (loan.interestRate / 100)) / 12));
  const todayStr = new Date().toISOString().slice(0, 10);

  // Filter payments for this specific loan
  const loanPayments = (payments || []).filter(p => p.loanId === loan.id || p.loanNo === loan.loanNo);

  const schedule = [];

  for (let i = 1; i <= tenure; i++) {
    // EMI due date = start date + (i - 1) months
    const dueDate = addMonthsToDate(startDate, i - 1);
    
    // Check if this EMI is covered by a payment
    const payment = loanPayments[i - 1]; // matching by index order or payment record

    let status = 'Upcoming';
    let daysOverdue = 0;
    let daysLeft = 0;

    if (loan.status === 'Closed') {
      status = 'Paid';
    } else if (payment) {
      status = 'Paid';
    } else {
      const diff = getDaysDiff(dueDate, todayStr);
      if (diff > 0) {
        status = 'Overdue';
        daysOverdue = diff;
      } else if (diff === 0) {
        status = 'Due Today';
      } else {
        status = 'Upcoming';
        daysLeft = Math.abs(diff);
      }
    }

    schedule.push({
      emiNo: i,
      totalEmis: tenure,
      dueDate,
      amount: emiAmount,
      status,
      paidDate: payment ? payment.date : (loan.status === 'Closed' ? loan.closedDate || dueDate : null),
      receiptNo: payment ? payment.receiptNo : (loan.status === 'Closed' ? 'CLOSED-AUTO' : null),
      mode: payment ? payment.mode : null,
      daysOverdue,
      daysLeft
    });
  }

  return schedule;
};

/**
 * Get Customer 360 Summary including active loans, closed loans, total EMIs paid & due
 */
export const getCustomer360Profile = (customer, allLoans = [], allPayments = []) => {
  if (!customer) return null;

  const customerLoans = allLoans.filter(l => 
    (l.mobile && customer.mobile && l.mobile === customer.mobile) ||
    (l.memberNo && customer.id && l.memberNo === customer.id) ||
    (l.customerName && customer.name && l.customerName.toLowerCase() === customer.name.toLowerCase())
  );

  const activeLoans = customerLoans.filter(l => l.status === 'Active');
  const closedLoans = customerLoans.filter(l => l.status === 'Closed');

  let totalBorrowed = 0;
  let totalActiveSanctioned = 0;
  let totalClosedAmount = 0;

  let totalEmisCount = 0;
  let paidEmisCount = 0;
  let overdueEmisCount = 0;
  let upcomingEmisCount = 0;
  let totalInterestPaid = 0;

  const loansWithSchedules = customerLoans.map(loan => {
    const schedule = getLoanEmiSchedule(loan, allPayments);
    const paidList = schedule.filter(s => s.status === 'Paid');
    const overdueList = schedule.filter(s => s.status === 'Overdue');
    const upcomingList = schedule.filter(s => s.status === 'Upcoming' || s.status === 'Due Today');

    totalBorrowed += Number(loan.loanAmount || 0);
    if (loan.status === 'Active') {
      totalActiveSanctioned += Number(loan.loanAmount || 0);
    } else {
      totalClosedAmount += Number(loan.loanAmount || 0);
    }

    totalEmisCount += schedule.length;
    paidEmisCount += paidList.length;
    overdueEmisCount += overdueList.length;
    upcomingEmisCount += upcomingList.length;

    paidList.forEach(p => {
      totalInterestPaid += p.amount;
    });

    return {
      ...loan,
      schedule,
      paidEmis: paidList.length,
      remainingEmis: schedule.length - paidList.length,
      overdueEmis: overdueList.length
    };
  });

  return {
    customer,
    allLoans: loansWithSchedules,
    activeLoans: loansWithSchedules.filter(l => l.status === 'Active'),
    closedLoans: loansWithSchedules.filter(l => l.status === 'Closed'),
    totalBorrowed,
    totalActiveSanctioned,
    totalClosedAmount,
    totalEmisCount,
    paidEmisCount,
    overdueEmisCount,
    upcomingEmisCount,
    totalInterestPaid
  };
};

/**
 * Get all EMIs due across all active loans for the EMI Tracker Page & Alerts
 */
export const getAllEmiItems = (allLoans = [], allPayments = []) => {
  const activeLoans = allLoans.filter(l => l.status === 'Active');
  const emiList = [];

  activeLoans.forEach(loan => {
    const schedule = getLoanEmiSchedule(loan, allPayments);
    schedule.forEach(emi => {
      emiList.push({
        ...emi,
        loanId: loan.id,
        loanNo: loan.loanNo,
        memberNo: loan.memberNo,
        customerName: loan.customerName,
        mobile: loan.mobile,
        itemType: loan.itemType,
        itemName: loan.itemName,
        loanAmount: loan.loanAmount,
        interestRate: loan.interestRate,
        loanDate: loan.loanDate
      });
    });
  });

  return emiList;
};
