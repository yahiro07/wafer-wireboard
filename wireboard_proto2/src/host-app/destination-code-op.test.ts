import { expect, it } from "vitest";
import {
  destinationCodeOp,
  destinationCodeOp_testExports,
} from "@/host-app/destination-code-op";

const { helpers } = destinationCodeOp_testExports;

it("helpers.decodeChannelPorts", () => {
  {
    const result = helpers.decodeChannelPorts("unit1|unit2&unit3");
    expect(result).toEqual([new Set(["unit1"]), new Set(["unit2", "unit3"])]);
  }
});

it("helpers.encodeChannelPorts", () => {
  {
    const result = helpers.encodeChannelPorts([
      new Set(["unit1"]),
      new Set(["unit2", "unit3"]),
    ]);
    expect(result).toBe("unit1|unit2&unit3");
  }
});

it("destinationCodeOp.isIncluded", () => {
  {
    const result = destinationCodeOp.isIncluded(undefined, "unit1");
    expect(result).toBe(false);
  }
  {
    const result = destinationCodeOp.isIncluded("unit1|unit2", "unit1");
    expect(result).toBe(true);
  }
  {
    const result = destinationCodeOp.isIncluded("unit1&unit2|unit3", "unit2");
    expect(result).toBe(true);
  }
  {
    const result = destinationCodeOp.isIncludedAt("unit1|unit2", "unit1", 1);
    expect(result).toBe(false);
  }
});

it("destinationCodeOp.add", () => {
  {
    const result = destinationCodeOp.add(undefined, "unit1");
    expect(result).toBe("unit1");
  }
  {
    const result = destinationCodeOp.add("unit1", "unit2");
    expect(result).toBe("unit1&unit2");
  }
  {
    const result = destinationCodeOp.add("unit1", "unit2", {
      sourcePortIndex: 1,
    });
    expect(result).toBe("unit1|unit2");
  }
  {
    const result = destinationCodeOp.add("unit1", "unit2", {
      sourcePortIndex: 3,
    });
    expect(result).toBe("unit1|||unit2");
  }
  {
    const result = destinationCodeOp.add("unit1|unit2", "unit3", {
      sourcePortIndex: 1,
    });
    expect(result).toBe("unit1|unit2&unit3");
  }
  {
    const result = destinationCodeOp.add("unit1|unit2", "unit2", {
      sourcePortIndex: 0,
    });
    expect(result).toBe("unit1&unit2|unit2");
  }
});

it("destinationCodeOp.remove", () => {
  {
    const result = destinationCodeOp.remove("unit1", "unit1");
    expect(result).toBe("");
  }
  {
    const result = destinationCodeOp.remove("unit1|unit2&unit3", "unit2", {
      sourcePortIndex: 1,
    });
    expect(result).toBe("unit1|unit3");
  }
});
