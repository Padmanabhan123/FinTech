function Dashboard() {
  const dashboard = document.createElement('div');
  dashboard.id = 'dashboard';

  const progressBar = document.createElement('progress');
  progressBar.id = 'progress-bar';
  progressBar.max = 100;
  progressBar.value = 0;
  dashboard.appendChild(progressBar);

  const balanceElement = document.createElement('p');
  balanceElement.textContent = 'Account Balance: Loading...';
  dashboard.appendChild(balanceElement);

  const transactionList = document.createElement('ul');
  transactionList.id = 'transactions';
  dashboard.appendChild(transactionList);

  fetch('/api/accounts/my-account')
    .then(response => response.json())
    .then(data => {
      progressBar.value = 100;
      balanceElement.textContent = `Account Balance: ${data.balance}`;

      data.transactions.forEach(transaction => {
        const listItem = document.createElement('li');
        listItem.textContent = `${transaction.type} - ${transaction.amount}`;
        transactionList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('Error fetching account data:', error);
      progressBar.value = 0;
      // Handle error, e.g., display error message
    });

  return dashboard;
}

export default Dashboard;
