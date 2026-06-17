function modifyCodesUnique(
  destSpec: string,
  fn: (codeSet: Set<string>) => void,
) {
  const codes = destSpec.split("&");
  const codeSet = new Set(codes);
  fn(codeSet);
  return Array.from(codeSet).join("&");
}

export const unitDestSpecOp = {
  add(destSpec: string, code: string) {
    return modifyCodesUnique(destSpec, (codeSet) => {
      codeSet.add(code);
    });
  },
  remove(destSpec: string, code: string) {
    return modifyCodesUnique(destSpec, (codeSet) => {
      codeSet.delete(code);
    });
  },
  toggle(destSpec: string, code: string) {
    return modifyCodesUnique(destSpec, (codeSet) => {
      if (codeSet.has(code)) {
        codeSet.delete(code);
      } else {
        codeSet.add(code);
      }
    });
  },
};
