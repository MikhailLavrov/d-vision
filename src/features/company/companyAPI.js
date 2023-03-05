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
  addInventory(itemName, countNumber, placeId) {
    const inventoryRef = getFirestoreCollection("inventory").doc();
    const generatedId = inventoryRef.id;
    console.log('Это в АПИ: ', generatedId, itemName, countNumber, placeId);
    return inventoryRef.set({
      id: generatedId,
      name: itemName,
      count: countNumber,
      placeId: placeId
    }).then(() => generatedId);
  },  
  // Удаление оборудования
  deleteInventory(itemId) {
    return getFirestoreCollection("inventory").doc(itemId)
          .delete()
  },
  // Обновление записи оборудования
  updateInventory(id, count) {
    console.log('Апи редактирования ', 'id: ' ,id, 'count' ,count);
    return getFirestoreCollection("inventory").doc(id)
          .set({
            count: count
          })
  },
}
