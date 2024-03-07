/**
 *  @description Generates a unique identifier for a chat room between two users
 * @param {string} id1 Id of the user requesting to open a chat
 * @param {string} id2 Id of the user requested by param 1
 * @returns {string} Unique room ID for user 1 with id1 and user 2 with id2
 */
export const createRoom = (id1: string, id2: string) => {
  // make sure id1 is the smaller value for
  // consistency of generation
  if (id1 > id2) {
    // swap two values
    let temp = id2;
    id2 = id1;
    id1 = temp;
  }
  return id1 + '|' + id2;
};
