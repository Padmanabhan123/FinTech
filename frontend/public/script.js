const app = document.getElementById("app");

const token = localStorage.getItem("token");

if (token) {
  fetch("/api/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((user) => {
      const dashboard = document.createElement("div");
      dashboard.innerHTML = `
      <h2>Welcome, ${user.name}!</h2>
      <p id="balance">Loading...</p>
      <select id="filter">
        <option value="all">All</option>
        <option value="deposit">Deposits</option>
        <option value="withdrawal">Withdrawals</option>
      </select>
      <ul id="transactions"></ul>
      <form id="transactionForm">
        <label for="amount">Amount:</label>
        <input type="number" id="amount" name="amount" required>
        <label for="type">Type:</label>
        <select id="type" name="type">
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
        </select>
        <button type="submit">Create Transaction</button>
      </form>
    `;
      app.appendChild(dashboard);

      fetch(`/api/accounts/my-account`)
        .then((response) => response.json())
        .then((account) => {
          const balanceElement = document.getElementById("balance");
          balanceElement.textContent = `Account Balance: ${account.balance}`;
        })
        .catch((error) => {
          console.error("Error fetching account data:", error);
        });

      let transactions = [];
      fetch(`/api/transactions/user`)
        .then((response) => response.json())
        .then((data) => {
          transactions = data;
          updateTransactionList(transactions);
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
        });

      const filterSelect = document.getElementById("filter");
      filterSelect.addEventListener("change", () => {
        const filter = filterSelect.value;
        const filteredTransactions = transactions.filter((transaction) => {
          return filter === "all" || transaction.type === filter;
        });
        updateTransactionList(filteredTransactions);
      });

      const transactionForm = document.getElementById("transactionForm");
      transactionForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;

        const accountId = user.accounts[0]._id;
        fetch("/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accountId, amount, type }),
        })
          .then((response) => {
            if (response.ok) {
              // Handle successful transaction creation
              return response.json();
            } else {
              throw new Error("Transaction creation failed");
            }
          })
          .then((data) => {
            transactions.push(data);
            updateTransactionList(transactions);
            // You can display a success message here (optional)
            console.log("Transaction created successfully!");
          })
          .catch((error) => {
            console.error("Error creating transaction:", error);
            // You can display an error message to the user here
          });
      });

      function updateTransactionList(transactions) {
        const transactionList = document.getElementById("transactions");
        transactionList.innerHTML = "";
        transactions.forEach((transaction) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${transaction.type} - ${transaction.amount}`;
          transactionList.appendChild(listItem);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
} else {
  // Show login form
  const loginForm = document.createElement("form");
  loginForm.innerHTML = `
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required>
    <button type="submit">Login</button>
  `;
  app.appendChild(loginForm);

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Form submitted:", { email, password }); // Add console log

    fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Login failed");
        }
      })
      .then((data) => {
        console.log("Login successful:", data); // Add console log
        // Handle successful login
      })
      .catch((error) => {
        console.error("Login error:", error);
        // Display error message to user
      });
  });
}
