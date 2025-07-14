export const getLocalBalance = (): number => {
  const stored = localStorage.getItem("simulatedBalance");
  return stored ? parseFloat(stored) : 0;
};

export const setLocalBalance = (amount: number): void => {
  localStorage.setItem("simulatedBalance", amount.toFixed(2));
};

export const updateLocalBalance = (delta: number): void => {
  const current = getLocalBalance();
  setLocalBalance(current + delta);
};
