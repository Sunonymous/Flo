// This is a tool to compose a class for an HTML element. It is passed an array.
// The array contains class "fragments", which are either a string for classes
// required in all cases, or another sub-array. Sub-arrays have a function or
// value given for their first element, and the resulting class element for the
// second element. If the value at the first index or the returned value from executing
// the function is truthy, the string at the second index is returned.
// The final class is simply a joining of all the fragments with a space.

//    classFragment :: String | [Any, String]
// constructedClass :: [classFragment] -> String

const builtClass = (classFragments) => {
  const identity = (x) => x;
  const secondElementIfFirstTruthy = (arr) => {
    const toEvaluate = arr[0];
    const classToAdd = arr[1];
    const evaluation =
      typeof toEvaluate === "function" ? toEvaluate() : !!toEvaluate;

    return evaluation ? classToAdd : "";
  };

  const constructionFunctions = {
    0:    () => "",
    1: (arr) => arr[0],
    2: secondElementIfFirstTruthy,
  };

  const constructionFunc = (fragment) => {
    if (typeof fragment === "string") return identity;

    const functionToCall = constructionFunctions[fragment.length];
    if (!functionToCall) {
      console.warn(`Given fragment ${fragment} with invalid length. Ignoring.`);
      return '';
    }

    return functionToCall;
  };

  return classFragments.map((frag) => constructionFunc(frag)(frag)).filter(identity).join(" ");
};

export default builtClass;
