type ChannelPorts = Set<string>[];

const helpers = {
  decodeChannelPorts(portCodes: string): ChannelPorts {
    return portCodes.split("|").map((spec) => {
      if (spec.includes("&")) {
        return new Set(
          spec
            .split("&")
            .map((s) => s.trim())
            .filter(Boolean),
        );
      } else {
        return new Set([spec]);
      }
    });
  },
  encodeChannelPorts(channelPorts: ChannelPorts): string {
    return channelPorts
      .map((ports) => {
        return [...ports].filter(Boolean).join("&");
      })
      .join("|");
  },
};
export const destinationCodeOp_testExports = {
  helpers,
};

export const destinationCodeOp = {
  isIncluded(portsCode: string | undefined, portCode: string): boolean {
    if (portsCode === undefined) return false;
    return portsCode.split(/[|&]/).includes(portCode);
  },
  add(
    currentPortsCode: string | undefined,
    portCode: string,
    options?: {
      sourcePortIndex: number;
    },
  ): string | undefined {
    const sourcePortIndex = options?.sourcePortIndex ?? 0;
    const channelPorts = helpers.decodeChannelPorts(currentPortsCode ?? "");
    channelPorts[sourcePortIndex] ??= new Set();
    channelPorts[sourcePortIndex].add(portCode);
    return helpers.encodeChannelPorts(channelPorts) ?? undefined;
  },
  remove(
    currentPortsCode: string | undefined,
    portCode: string,
    options?: {
      sourcePortIndex: number;
    },
  ): string | undefined {
    const sourcePortIndex = options?.sourcePortIndex ?? 0;
    const channelPorts = helpers.decodeChannelPorts(currentPortsCode ?? "");
    channelPorts[sourcePortIndex]?.delete(portCode);
    return helpers.encodeChannelPorts(channelPorts) ?? undefined;
  },
};
