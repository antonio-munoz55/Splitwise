import { User } from "./user.js";
import { Spend } from "./spend.js";

// Get references to HTML elements for users, expenses, balances, and actions
const usersListElement = document.querySelector(".usersList");
const expenseListElement = document.querySelector(".expenseList");
const balancesListElement = document.querySelector(".balancesList");
const userOptionsElement = document.querySelector("#userOptions");
const settleUpElement = document.querySelector("#settleUp");

// Arrays to store users, expenses, and balance information
const users = [];
const spends = [];
const usersBalances = [];

// Settle up balances when button is clicked
settleUpElement.addEventListener("click", settleUp);

// Display the selected page and hide others
window.displayPage = function (pageID) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(pageID).classList.add('active');
}

// Form submission handler for adding a new user
document.getElementById('myForm').addEventListener('submit', function (event) {
  event.preventDefault();
  
  // Retrieve values for genre, name, and icon
  let genre = document.querySelector('input[name="genre"]:checked');
  let name = document.getElementById('name');
  let icon = document.querySelector('input[name="icon"]:checked');

  // Regular expression for validating the name
  let nameRegex = /^[^\s][a-zA-Z\s]*$/
  let nameValidate = false;

  if (nameRegex.test(name.value)){
    nameValidate = true
  }
  
  if (!genre || !nameValidate || !icon) {
    alert("Some of the fields are empty or invalid");
    return;
  }

  // Save user data if validation passes
  let genreAdd = genre.value;
  let nameAdd = name.value;
  let iconAdd = "./src/img/" + icon.value + ".png";

  console.log('Selected genre:', genreAdd);
  console.log('Name:', nameAdd);
  console.log('Icon: ', iconAdd);

  // Create a new User instance and add to users array
  let user = new User(nameAdd, genreAdd, iconAdd);
  users.push(user);

  console.log(users);

  addUsersList(); // Refresh user list
  addUserSelect(); // Refresh user selection options
  clearForm("myForm");
});

// Form submission handler for adding an expense
document.getElementById('myForm2').addEventListener('submit', function (event) {
  event.preventDefault();

  // Get selected user and validate it
  let userOptionsElement = document.querySelector('select[name="userOptions"]');
  let selectedOption = userOptionsElement.options[userOptionsElement.selectedIndex];

  if (!selectedOption || selectedOption.value === "-") {
    alert("Please select a user");
    return;
  }

  // Get the selected user's details and expense details
  let userIndex = selectedOption.value;
  let selectedUser = users[userIndex];

  let amount = document.getElementById('amount');
  let title = document.getElementById('title');

  // Regular expressions for validating amount and title
  let amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/
  let amountValidate = false;

  let titleRegex = /^[^\s][a-zA-Z\s]*$/
  let titleValidate = false;

  if (amountRegex.test(amount.value)){
    amountValidate = true;
  }

  if (titleRegex.test(title.value)){
    titleValidate = true;
  }

  if (!amountValidate || !titleValidate) {
    alert("Some of the fields are empty or invalid");
    return;
  }

  // Prepare and save the expense data
  let amountAdd = amount.value;
  let titleAdd = title.value;

  console.log('Amount:', amountAdd);
  console.log('Title: ', titleAdd);

  let date = new Date();
  let day = date.getDate();
  let month = date.toLocaleString('default', { month: 'short' });
  let dateAdd = `${day} ${month}`;

  // Update user’s total paid amount
  selectedUser.paid = Number(selectedUser.paid) + Number(amountAdd);

  // Calculate balances
  let totalSpent = 0;
  for (let i = 0; i < users.length; i++) {
    totalSpent = Number(totalSpent) + Number(users[i].paid);
  }

  let averageSpent = totalSpent / users.length;
  users.forEach(user => {
    if (user.paid > averageSpent) {
      user.owed = Number(user.paid) - Number(averageSpent);
    } else {
      user.owed = 0;
    }
  });

  // Create a new Spend instance and add to spends array
  let spend = new Spend(selectedUser, amountAdd, titleAdd, dateAdd);
  spends.push(spend);

  // Track user in balance list if they aren't already included
  if (!usersBalances.includes(selectedUser)) {
    usersBalances.push(selectedUser);
  }

  addExpensesList(); // Refresh expense list
  addBalances(); // Refresh balance list
  clearForm("myForm2");
});

// Clear form fields after submission
function clearForm(formId) {
  document.getElementById(formId).reset();
}

// Function to update user list on the Users page
function addUsersList() {
  usersListElement.innerHTML = "";

  for(let i = 0; i < users.length; i++){
    let user = document.createElement("div");
    user.setAttribute("class", "userContainer");
    usersListElement.append(user);

    let userIcon = document.createElement("img");
    userIcon.setAttribute("src", users[i].icon);
    userIcon.setAttribute("class", "userIcon");
    user.append(userIcon);

    let userName = document.createElement("p");
    userName.textContent = users[i].name;
    user.append(userName);

    // Add delete button to remove a user
    let buttonDelete = document.createElement("button");
    buttonDelete.textContent = "X";
    buttonDelete.setAttribute("class", "deleteUser");
    buttonDelete.addEventListener("click", () => {
      users.splice(i, 1);
      addUsersList();
      addUserSelect();
    });
    user.append(buttonDelete); 
  }
}

// Function to display the list of expenses
function addExpensesList() {
  expenseListElement.innerHTML = "";

  for(let i = 0; i < spends.length; i++){
    let expense = document.createElement("div");
    expense.setAttribute("class", "expenseContainer");
    expenseListElement.append(expense);

    let expenseDate = document.createElement("h3");
    expenseDate.textContent = spends[i].date;
    expense.append(expenseDate);

    let expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", "./src/img/moneyBag.png");
    expenseIcon.setAttribute("class", "expenseIcon");
    expense.append(expenseIcon);

    let expenseTitle = document.createElement("h3");
    expenseTitle.textContent = spends[i].title;
    expense.append(expenseTitle);

    let userAmountExpense = document.createElement("p");
    userAmountExpense.textContent = `${spends[i].user.name} paid ${spends[i].amount} €`;
    expense.append(userAmountExpense);
  }
}

// Function to update the user selection dropdown for adding expenses
function addUserSelect() {
  userOptionsElement.innerHTML = '<option value="-" selected disabled>-- Select a user --</option>';

  for(let i = 0; i < users.length; i++){
    let userOption = document.createElement("option");
    userOption.setAttribute("value", i);
    userOption.textContent = users[i].name;
    userOptionsElement.append(userOption);
  }
}

// Function to display each user's balance on the Balances page
function addBalances() {
  balancesListElement.innerHTML = "";

  for(let i = 0; i < usersBalances.length; i++){
    let balance = document.createElement("div");
    balance.setAttribute("class", "balanceContainer");
    balancesListElement.append(balance);

    let balanceUserIcon = document.createElement("img");
    balanceUserIcon.setAttribute("src", usersBalances[i].icon);
    balanceUserIcon.setAttribute("class", "balanceUserIcon");
    balance.append(balanceUserIcon);

    let infoBalance = document.createElement("div");
    balance.append(infoBalance);

    let user = document.createElement("h3");
    user.textContent = `User: ${usersBalances[i].name}`;
    infoBalance.append(user);

    let genre;
    if(usersBalances[i].genre === "male"){
      genre = "He "
    } else {
      genre = "She "
    }

    let paid = document.createElement("p");
    paid.textContent = genre + `has paid: ${usersBalances[i].paid} €`;
    infoBalance.append(paid);

    let owed = document.createElement("p");
    owed.textContent = genre + `has owned: ${usersBalances[i].owed} €`;
    infoBalance.append(owed);
  }
}

// Reset balances for each user to zero when settling up
function settleUp() {
  users.forEach(user => {
    user.paid = 0;
    user.owed = 0;
  });

  addBalances();
}