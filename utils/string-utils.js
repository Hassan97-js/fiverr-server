function fromKebabToPascal(str) {
  if (str === "") {
    return "";
  }

  if (!str || typeof str !== "string") {
    throw Error("Invalid string");
  }

  const [firstWord, secondWord] = str.toLowerCase().replace("-", " ").split(" ");

  const firstCapitalized = firstWord[0].toUpperCase() + firstWord.slice(1);
  const secondCapitalized = secondWord[0].toUpperCase() + secondWord.slice(1);

  return `${firstCapitalized} ${secondCapitalized}`;
}

export { fromKebabToPascal };
