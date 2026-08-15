declare const __CfPagesUrl: string;
declare const __CfPagesCommitSha: string;
declare const __CfPagesBranch: string;

export const appEnvs = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  cfPagesUrl: __CfPagesUrl,
  cfPagesCommitSha: __CfPagesCommitSha,
  cfPagesBranch: __CfPagesBranch,
  isAndroid: navigator.userAgent.includes("Android"),
};

export function appEnvsInit() {
  if (!appEnvs.isDevelopment) {
    console.log("cfPagesUrl", appEnvs.cfPagesUrl);
    console.log("cfPagesCommitSha", appEnvs.cfPagesCommitSha);
    console.log("cfPagesBranch", appEnvs.cfPagesBranch);
  }
}
