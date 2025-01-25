import { Link } from 'react-router-dom';

const knowledgeBase = {
  banking: {
    accounts: {
      savings: "A savings account is a deposit account that earns interest over time. Would you like to open a savings account? <Link to='/open-account'>Click here</Link>.",
      checking: "A checking account is designed for frequent transactions. It does not earn interest but offers overdraft facilities. <Link to='/open-account'>Open an account now</Link>.",
      moneyMarket: "A money market account offers higher interest rates with some transaction limits. <Link to='/open-account'>Start your application</Link>."
    },
    loans: [
      "Common types of loans:\n\n- Personal Loans: For general purposes\n- Home Loans/Mortgages: For buying property\n- Auto Loans: For vehicle purchases\n- Business Loans: For business expenses\n- Student Loans: For education expenses",
      "Loan application requirements typically include:\n\n- Credit Score Check\n- Income Verification\n- Employment History\n- Collateral (for secured loans)\n- Debt-to-Income Ratio",
    ],
    investments: [
      "Investment options include:\n\n- Stocks: Company ownership shares\n- Bonds: Government and corporate debt\n- Mutual Funds: Professionally managed portfolios\n- ETFs: Exchange-traded funds\n- Retirement Accounts (401k, IRA)",
      "Investment tips:\n\n- Diversify your portfolio\n- Start early for compound growth\n- Consider your risk tolerance\n- Regular portfolio rebalancing\n- Long-term investment strategy",
    ],
    creditCards: [
      "Credit card features:\n\n- Rewards Programs\n- Cash Back Options\n- Travel Benefits\n- Purchase Protection\n- Zero Liability Protection\n- Credit Building Opportunities",
      "Credit card best practices:\n\n- Pay full balance monthly\n- Keep utilization below 30%\n- Monitor statements regularly\n- Protect card information\n- Review annual fees",
    ],
    security: [
      "Banking security measures:\n\n- Two-Factor Authentication\n- Encryption\n- Fraud Monitoring\n- Secure Mobile Banking\n- Regular Security Updates",
      "Protect your account:\n\n- Use strong passwords\n- Never share account details\n- Monitor transactions regularly\n- Enable account alerts\n- Report suspicious activity immediately",
    ],
  },
  general: {
    greetings: [
      "Hello! I'm BoltAI, your banking assistant. How can I help you today?",
      "Hi there! I'm here to help with your banking and financial questions.",
      "Welcome! I'm your AI banking assistant. What would you like to know about our services?",
    ],
    capabilities: [
      "I can help you with:\n\n- Account Information\n- Loan Details\n- Investment Options\n- Credit Card Services\n- Banking Security\n- Financial Planning",
    ],
  },
  calculator: {
    loan: (amount, rate, years) => {
      try {
        const monthlyRate = (rate / 100) / 12;
        const months = years * 12;
        const payment = amount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        return `Monthly Payment: $${payment.toFixed(2)}\nTotal Payment: $${(payment * months).toFixed(2)}`;
      } catch {
        return "Please provide valid loan details (amount, interest rate, years).";
      }
    }
  }
};

const getRandomResponse = (responses) => {
  return responses[Math.floor(Math.random() * responses.length)];
};

const isLoanCalculation = (text) => {
  return text.toLowerCase().includes('calculate') && text.toLowerCase().includes('loan');
};

export const findResponse = (input) => {
  const lowercaseInput = input.toLowerCase();
  
  if (isLoanCalculation(input)) {
    const numbers = input.match(/\d+/g);
    if (numbers && numbers.length >= 3) {
      return knowledgeBase.calculator.loan(Number(numbers[0]), Number(numbers[1]), Number(numbers[2]));
    }
    return "To calculate loan payments, please provide: loan amount, interest rate, and loan term in years.";
  }

  if (lowercaseInput.includes('account') || lowercaseInput.includes('banking')) {
    if (lowercaseInput.includes('savings')) {
      return knowledgeBase.banking.accounts.savings;
    }
    if (lowercaseInput.includes('checking')) {
      return knowledgeBase.banking.accounts.checking;
    }
    if (lowercaseInput.includes('money market')) {
      return knowledgeBase.banking.accounts.moneyMarket;
    }
  }
  
  if (lowercaseInput.includes('loan') || lowercaseInput.includes('mortgage')) {
    return getRandomResponse(knowledgeBase.banking.loans);
  }
  
  if (lowercaseInput.includes('invest') || lowercaseInput.includes('stock') || lowercaseInput.includes('bond')) {
    return getRandomResponse(knowledgeBase.banking.investments);
  }

  if (lowercaseInput.includes('credit card') || lowercaseInput.includes('credit score')) {
    return getRandomResponse(knowledgeBase.banking.creditCards);
  }

  if (lowercaseInput.includes('security') || lowercaseInput.includes('protect') || lowercaseInput.includes('fraud')) {
    return getRandomResponse(knowledgeBase.banking.security);
  }

  if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi') || lowercaseInput.includes('hey')) {
    return getRandomResponse(knowledgeBase.general.greetings);
  }

  if (lowercaseInput.includes('what can you do') || lowercaseInput.includes('help me')) {
    return getRandomResponse(knowledgeBase.general.capabilities);
  }

  if (lowercaseInput.startsWith('what is') || lowercaseInput.startsWith('what are')) {
    const topic = input.replace(/what (is|are)/i, '').trim();
    return `Let me explain about ${topic} in banking:\n\n` +
           `I'll provide relevant information about ${topic}. ` +
           `Could you please specify what aspect of ${topic} you'd like to learn about?`;
  }

  if (lowercaseInput.startsWith('how to') || lowercaseInput.startsWith('how do')) {
    const topic = input.replace(/how (to|do)/i, '').trim();
    return `Here's a guide for ${topic}:\n\n` +
           `1. I'll help you understand the process\n` +
           `2. We can break it down into steps\n` +
           `3. I'll provide specific banking-related information\n\n` +
           `Could you provide more details about your specific needs?`;
  }

  return "I'm your BoltAI Banking Assistant. I can help you with:\n\n" +
         "- Bank Accounts and Services\n" +
         "- Loans and Mortgages\n" +
         "- Investment Options\n" +
         "- Credit Cards\n" +
         "- Banking Security\n" +
         "- Financial Calculations\n\n" +
         "Please feel free to ask any banking or financial question!";
};