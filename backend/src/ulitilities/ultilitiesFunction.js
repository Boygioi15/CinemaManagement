import validator from "validator";

export function validateEmail(email) {
  // Check if the email is in a valid format using the validator package
  return validator.isEmail(email);
}

export function validatePhone(phone) {
  // Check if the phone is a string of numbers with exactly 10 digits
  return validator.isNumeric(phone) && phone.length === 10;
}
export function generateRandomVerifyCode(length = 8) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}
