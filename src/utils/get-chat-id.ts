export const getChatId = (isSeller: boolean, sellerId: string, buyerId: string) => {
  if (typeof isSeller !== "boolean" || !sellerId || !buyerId) {
    return "";
  }

  return isSeller ? `${sellerId}-${buyerId}` : `${buyerId}-${sellerId}`;
};
