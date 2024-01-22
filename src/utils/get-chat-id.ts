export const getChatId = (userId: string, sellerId: string, buyerId: string) => {
  if (!userId || !sellerId || !buyerId) {
    return "";
  }

  return userId === sellerId ? `${sellerId}-${buyerId}` : `${buyerId}-${sellerId}`;
};
