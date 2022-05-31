module.exports.handler = async ({ book, quantity }) => {
  return {
    total: book.price * quantity,
  };
};
