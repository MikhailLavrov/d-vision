/* eslint-disable no-undef */

export const getFirestoreCollection = (collectionName) => {
  return firebase.firestore().collection(collectionName);
}

export const companyAPI = {
  // Получение информации о зданиях и комнатах
  getPlaces() {
    return getFirestoreCollection("places").get()
  },
  // Получение информации об оборудовании
  getInventory() {
    return getFirestoreCollection("inventory").get()
  },
  // Добавление оборудования
  addInventory(placeId, itemName, countNumber) {
    return getFirestoreCollection("inventory").doc()
          .set({
            name: itemName,
            count: countNumber,
            place: getFirestoreCollection("places").doc(placeId)
          })
  },
  // Удаление оборудования
  deleteInventory(itemId) {
    return getFirestoreCollection("inventory").doc(itemId)
          .delete()
  },
  // Обновление записи оборудования
  updateInventory(id, count) {
    console.log('Привет это Апи ', id, count);
    return getFirestoreCollection("inventory").doc(id)
          .set({
            count: count
          })
  },
}
