// vitest/AppDataLoader.test.js
import {describe, it, expect, vi, beforeEach} from "vitest";

// Use relative path for ESM import

import {getSampleFamily} from "../public/utility/SampleFamily.js";

beforeEach(() => {});

describe("getSampleFamily", () => {
  it("returns a sample family object with persons array", () => {
    const family = getSampleFamily();
    expect(family).toBeDefined();
    expect(typeof family).toBe("object");
    expect(Array.isArray(family.persons)).toBe(true);
    expect(family.persons.length).toBe(9);
  });
});
