export const appEnvs = {
  isDevelopment: import.meta.env.DEV,
};

declare const __CfPagesUrl: string;
declare const __CfPagesCommitSha: string;
declare const __CfPagesBranch: string;
const win = window as any;
Object.assign(win, {
  __CfPagesUrl,
  __CfPagesCommitSha,
  __CfPagesBranch,
});

export function appEnvsInit() {
  if (1) {
    console.log("__CfPagesUrl", __CfPagesUrl);
    console.log("__CfPagesCommitSha", __CfPagesCommitSha);
    console.log("__CfPagesBranch", __CfPagesBranch);
  }
}
