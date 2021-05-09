const NormalizeString = (str) => {
  const words = str.trim().split(/\s+/);
  const wordres = [];
  words.forEach((word) => {
    const wordre = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    wordres.push(wordre);
  });
  const re = wordres.join(" ");
  return re;
};

export default NormalizeString;
