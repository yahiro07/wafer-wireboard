import { AppUnitDestinationSpec } from "@/model/types";

// function modifyCodesUnique(
//   destSpec: AppUnitDestinationSpec | undefined,
//   fn: (codeSet: Set<string>) => void,
// ): AppUnitDestinationSpec {
//   const codes = destSpec?.$primary ?? [];
//   const codeSet = new Set(codes);
//   fn(codeSet);
//   return { $primary: Array.from(codeSet) };
// }

// const _unitDestSpecOp_notInUse = {
//   add(
//     destSpec: AppUnitDestinationSpec | undefined,
//     code: string,
//   ): AppUnitDestinationSpec {
//     return modifyCodesUnique(destSpec, (codeSet) => {
//       codeSet.add(code);
//     });
//   },
//   remove(destSpec: AppUnitDestinationSpec, code: string) {
//     return modifyCodesUnique(destSpec, (codeSet) => {
//       codeSet.delete(code);
//     });
//   },
//   toggle(
//     destSpec: AppUnitDestinationSpec | undefined,
//     code: string,
//   ): AppUnitDestinationSpec {
//     return modifyCodesUnique(destSpec, (codeSet) => {
//       if (codeSet.has(code)) {
//         codeSet.delete(code);
//       } else {
//         codeSet.add(code);
//       }
//     });
//   },
// };

export function primaryDest(destSpec: string): AppUnitDestinationSpec {
  return { $primary: [destSpec] };
}
