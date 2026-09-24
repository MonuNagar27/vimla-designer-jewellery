const form = document.getElementById("accountForm");
const tabs = document.querySelectorAll(".tab");
const nameField = document.getElementById("name-field");
const nameInput = document.getElementById("customer-name");
const emailInput = document.getElementById("customer-email");
const passwordInput = document.getElementById("customer-password");
const loginOptions = document.getElementById("login-options");
const submitButton = document.getElementById("submit-button");
const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");
const message = document.getElementById("form-message");
let mode = "login";

function setMessage(text, success = false) {
  message.textContent = text;
  message.classList.toggle("success", success);
}

function setMode(nextMode) {
  mode = nextMode;
  const registering = mode === "register";
  nameField.hidden = !registering;
  nameInput.required = registering;
  loginOptions.hidden = registering;
  formTitle.textContent = registering ? "Create your jewellery room" : "Enter your jewellery room";
  formSubtitle.textContent = registering
    ? "Create an account to save favourites and receive private collection previews."
    : "Sign in to save favourites, follow orders and receive private collection previews.";
  submitButton.innerHTML = registering ? "Create my account <span>→</span>" : "Enter my account <span>→</span>";
  tabs.forEach((tab) => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  setMessage("");
  passwordInput.autocomplete = registering ? "new-password" : "current-password";
}

tabs.forEach((tab) => tab.addEventListener("click", () => setMode(tab.dataset.mode)));

document.querySelector(".password-toggle").addEventListener("click", (event) => {
  const visible = passwordInput.type === "text";
  passwordInput.type = visible ? "password" : "text";
  event.currentTarget.textContent = visible ? "Show" : "Hide";
  event.currentTarget.setAttribute("aria-label", visible ? "Show password" : "Hide password");
});

document.getElementById("forgot-password").addEventListener("click", () => {
  if (!emailInput.value) {
    setMessage("Enter your email address first and we will help you reset your password.");
    emailInput.focus();
    return;
  }
  setMessage(`Password reset instructions can be sent to ${emailInput.value}.`);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const account = { name: nameInput.value.trim(), email: emailInput.value.trim().toLowerCase() };
  if (mode === "register") {
    localStorage.setItem("vimlaCustomer", JSON.stringify(account));
    setMessage("Your private jewellery account has been created. Welcome to Vimla.", true);
    setMode("login");
    emailInput.value = account.email;
    return;
  }
  const savedAccount = JSON.parse(localStorage.getItem("vimlaCustomer") || "null");
  if (savedAccount && savedAccount.email === account.email) {
    setMessage(`Welcome back${savedAccount.name ? `, ${savedAccount.name}` : ""}. Your jewellery room is ready.`, true);
  } else {
    setMessage("For this preview, create an account first or connect this form to your secure customer database.");
  }
});
