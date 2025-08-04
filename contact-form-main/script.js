const radioDivs = document.querySelectorAll(".query-type");
const formGroups = document.querySelectorAll(".form-group");
const formElement = document.querySelector("form");
const toast = document.querySelector(".toast");
let formValid = true;

formElement.setAttribute("novalidate", "");

// ✅ Toggle selected background on radio
const changeRadioBg = () => {
  radioDivs.forEach(radioDiv => {
    const radio = radioDiv.querySelector("input");
    radioDiv.classList.toggle("radio-selected", radio.checked);
  });
};

// ✅ Display error
const displayError = (formGroup, message) => {
  const errorMessage = formGroup.querySelector(".error");
  if (errorMessage) {
    errorMessage.innerText = message;
    errorMessage.classList.remove("hidden");
  }
};

// ✅ Remove all errors
const removeError = formGroup => {
  const errorMessage = formGroup.querySelector(".error");
  if (errorMessage) {
    errorMessage.classList.add("hidden");
    errorMessage.innerText = "";
  }
};

// ✅ Validation logic
const validateGroup = formGroup => {
  const input = formGroup.querySelector("input, textarea");
  const inputType = input?.type || input?.tagName.toLowerCase();

  switch (inputType) {
    case "radio":
      const radios = formGroup.querySelectorAll("input[type='radio']");
      const checked = Array.from(radios).some(radio => radio.checked);
      if (!checked) {
        displayError(formGroup, "Please select an option.");
        formValid = false;
      }
      break;

    case "checkbox":
      if (!input.checked) {
        displayError(formGroup, "Please agree to proceed.");
        formValid = false;
      }
      break;

    case "text":
    case "textarea":
      if (input.value.trim() === "") {
        displayError(formGroup, "This field cannot be empty.");
        formValid = false;
      }
      break;

    case "email":
      const value = input.value.trim();
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (value === "") {
        displayError(formGroup, "Email is required.");
        formValid = false;
      } else if (!emailPattern.test(value)) {
        displayError(formGroup, "Enter a valid email address.");
        formValid = false;
      }
      break;
  }
};

// ✅ Show toast
const displayToast = () => {
  setTimeout(() => toast.classList.remove("hidden"), 10);
  setTimeout(() => toast.classList.add("hidden"), 4000);
};

// ✅ Show toast on reload
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("showToast") === "true") {
    displayToast();
    localStorage.removeItem("showToast");
  }
});

// ✅ Radio button click logic
radioDivs.forEach(radioDiv => {
  radioDiv.addEventListener("click", () => {
    const radioInput = radioDiv.querySelector("input");
    radioInput.checked = true;
    changeRadioBg();
    removeError(radioDiv.closest(".form-group"));
  });
});

// ✅ Form submit
formElement.addEventListener("submit", event => {
  event.preventDefault();
  formValid = true;

  formGroups.forEach(formGroup => {
    removeError(formGroup);
    validateGroup(formGroup);
  });

  if (formValid) {
    localStorage.setItem("showToast", "true");
    formElement.submit();
  }
});

// ✅ Input interaction (click and blur)
formGroups.forEach(formGroup => {
  const inputs = formGroup.querySelectorAll("input, textarea");
  inputs.forEach(input => {
    input.addEventListener("click", () => removeError(formGroup));
    input.addEventListener("blur", () => validateGroup(formGroup));
  });
});

// ✅ Toast click to dismiss
toast.addEventListener("click", () => toast.classList.add("hidden"));
