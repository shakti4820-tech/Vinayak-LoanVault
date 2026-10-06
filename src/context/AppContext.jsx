import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DEFAULT_LOANS_DEMO, 
  DEFAULT_CUSTOMERS_DEMO, 
  DEFAULT_PAYMENTS_DEMO 
} from '../assets/placeholders';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load saved state or default
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('riddhi_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('riddhi_user');
    return saved ? JSON.parse(saved) : { name: "Branch Manager", role: "Administrator", branch: "Kuchaman City" };
  });

  const [metalRates, setMetalRates] = useState(() => {
    const saved = localStorage.getItem('riddhi_rates');
    return saved ? JSON.parse(saved) : {
      gold24k: 7350,
      gold22k: 6737,
      gold20k: 6125,
      gold18k: 5512,
      silver999: 94,
      goldLtv: 75,
      silverLtv: 75,
      defaultInterestRate: 22.0 // % per annum
    };
  });

  const [loans, setLoans] = useState(() => {
    const saved = localStorage.getItem('riddhi_loans');
    return saved ? JSON.parse(saved) : DEFAULT_LOANS_DEMO;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('riddhi_customers');
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMERS_DEMO;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('riddhi_payments');
    return saved ? JSON.parse(saved) : DEFAULT_PAYMENTS_DEMO;
  });

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('riddhi_auth', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('riddhi_loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('riddhi_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('riddhi_rates', JSON.stringify(metalRates));
  }, [metalRates]);

  useEffect(() => {
    localStorage.setItem('riddhi_payments', JSON.stringify(payments));
  }, [payments]);

  // Auth methods
  const login = (username, password) => {
    // Simple demo validation (accepts admin/admin or 1234)
    if ((username === 'admin' && password === 'admin') || password === '1234' || username === 'manager') {
      setIsAuthenticated(true);
      setCurrentUser({ name: "Branch Manager", role: "Administrator", branch: "Kuchaman City" });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('riddhi_auth');
  };

  // Add new loan
  const addLoan = (newLoanData) => {
    setLoans(prev => [newLoanData, ...prev]);

    // Check if customer exists or add
    setCustomers(prev => {
      const exists = prev.some(c => c.mobile === newLoanData.mobile || c.id === newLoanData.memberNo);
      if (!exists) {
        return [{
          id: newLoanData.memberNo || `RVNL${Math.floor(1000000 + Math.random() * 9000000)}`,
          name: newLoanData.customerName,
          fatherName: newLoanData.fatherName,
          mobile: newLoanData.mobile,
          address: newLoanData.address,
          idProofType: newLoanData.idProofType,
          idProofNo: newLoanData.idProofNo,
          dateJoined: newLoanData.loanDate
        }, ...prev];
      }
      return prev;
    });
  };

  const addPayment = (payment) => {
    setPayments(prev => [payment, ...prev]);
    if (payment.type === 'Full Redemption / Loan Closure' || payment.type === 'Full Redemption') {
      closeLoan(payment.loanId);
    }
  };

  const closeLoan = (loanId) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId || loan.loanNo === loanId) {
        return {
          ...loan,
          status: 'Closed',
          closedDate: new Date().toISOString().slice(0, 10)
        };
      }
      return loan;
    }));
  };

  const updateMetalRates = (newRates) => {
    setMetalRates(prev => ({ ...prev, ...newRates }));
  };

  // Reset customer data to clean synthetic dummy demo data without affecting Admin settings
  const resetCustomerDataToDemo = () => {
    localStorage.removeItem('riddhi_loans');
    localStorage.removeItem('riddhi_customers');
    localStorage.removeItem('riddhi_payments');

    setLoans(DEFAULT_LOANS_DEMO);
    setCustomers(DEFAULT_CUSTOMERS_DEMO);
    setPayments(DEFAULT_PAYMENTS_DEMO);
  };

  const exportDataBackup = () => {
    const backup = {
      loans,
      customers,
      payments,
      metalRates,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Riddhi_LoanSystem_Backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  const importDataBackup = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.loans) setLoans(data.loans);
      if (data.customers) setCustomers(data.customers);
      if (data.payments) setPayments(data.payments);
      if (data.metalRates) setMetalRates(data.metalRates);
      return true;
    } catch (e) {
      console.error("Invalid backup file", e);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      currentUser,
      login,
      logout,
      loans,
      customers,
      payments,
      metalRates,
      addLoan,
      addPayment,
      closeLoan,
      updateMetalRates,
      resetCustomerDataToDemo,
      exportDataBackup,
      importDataBackup
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
