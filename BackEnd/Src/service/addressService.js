const Address = require("../models/addressModel");

module.exports = {
  async getAddressesByUserId(userId) {
    try {
      const addresses = await Address.find({ userId });
      if (!addresses.length) {
        throw new Error("No address found for user " + userId);
      }
      return addresses;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async updateAddress(addressId, userData) {
    try {
      const { street, city, state, zipcode, country } = userData;
      const address = await Address.updateOne(
        { _id: addressId },
        { street, city, state, zipcode, country }
      );
      return address;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async deleteAddress(addressId) {
    try {
      const removed = await Address.deleteOne({ _id: addressId });
      if (!removed.deletedCount) {
        return "Address not deleted";
      } else {
        return "Address deleted";
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
