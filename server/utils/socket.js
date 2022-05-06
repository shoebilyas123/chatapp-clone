exports.createRoom = (id1, id2) => {
  // make sure id1 is the smaller value for
  // consistency of generation
  if (id1 > id2) {
    // swap two values
    let temp = id2;
    id2 = id1;
    id1 = temp;
  }
  return id1 + "|" + id2;
};
