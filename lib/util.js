export function assertValid(object, varName) {
  if (object === null || object === undefined) {
    throw new Error(`'${varName}' must not be ${object}`);
  }
}

export function assertContains(collection, object, varName) {
  if (collection.indexOf(object) === -1) {
    throw new Error(`Collection does not contain '${object}' for '${varName}'. Must be one of ${collection}.`);
  }
}
