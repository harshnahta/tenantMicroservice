export const getCookie = (name: string) => {
  try {
    const value = `; ${document.cookie}`;
    const parts: any = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  } catch (e) {
    return null;
  }
};

export const isValidPhone = (phone: any) => {
  // Check if phone number is exactly 10 digits
  return /^\d{10}$/.test(phone);
};

export const isValidEmail = (email: string) => {
  // Basic email validation regex
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const capitalizeWords = (str: string) => {
  // Split the string into words
  const words = str.split(" ");

  // Capitalize the first letter of each word
  const capitalizedWords = words.map((word) => {
    // Capitalize the first letter of the word and make the rest lower case
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  // Join the capitalized words back into a string
  return capitalizedWords.join(" ");
};

export const truncateDescription = (description: string, maxLength: number) => {
  if (description.length <= maxLength) {
    return description;
  }

  let truncated = description.slice(0, maxLength);
  let lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex === -1) {
    return "";
  }

  return truncated.slice(0, lastSpaceIndex);
};
