export const getChatId = (sellerId: string, buyerId: string) => {
  if (!sellerId || !buyerId) {
    return "";
  }

  const sortedIds = [buyerId, sellerId].sort();
  const chatId = `${sortedIds[0]}-${sortedIds[1]}`;

  return chatId;
};
