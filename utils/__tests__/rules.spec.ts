import { describe, expect, it } from "vitest";
import type { Rule } from "~/types";
import { applyRuleFilter, applyRulesFilters } from "../rules";
import type { VEvent } from "node-ical";

const mockEvents: VEvent[] = [
  {
    type: "VEVENT",
    summary: "Team Meeting",
    description: "Weekly sync",
    location: "Room 101",
  },
  {
    type: "VEVENT",
    summary: "Lunch Break",
    description: "Team lunch",
    location: "Cafeteria",
  },
  {
    type: "VEVENT",
    summary: "Veterinary Appointment",
    description: "Checkup",
    location: "Veterinary Clinic",
  },
] as VEvent[];

describe("applyRuleFilter", () => {
  it("filters by summary contains", () => {
    const rule: Rule = { f: "s", t: "c", cs: true, v: "Team" };
    const filtered = applyRuleFilter(mockEvents, rule);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].summary).toBe("Team Meeting");
  });

  it("filters by description equals", () => {
    const rule: Rule = { f: "d", t: "=", cs: true, v: "Team lunch" };
    const filtered = applyRuleFilter(mockEvents, rule);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].summary).toBe("Lunch Break");
  });

  it("filters by location not equals", () => {
    const rule: Rule = { f: "l", t: "!", cs: true, v: "Room 101" };
    const filtered = applyRuleFilter(mockEvents, rule);
    expect(filtered).toHaveLength(2);
    expect(filtered[0].location).toBe("Cafeteria");
    expect(filtered[1].location).toBe("Veterinary Clinic");
  });

  it("filters by summary starts-with", () => {
    const rule: Rule = { f: "s", t: "s", cs: true, v: "Team" };
    const filtered = applyRuleFilter(mockEvents, rule);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].summary).toBe("Team Meeting");
  });

  it("filters by location ends-with", () => {
    const rule: Rule = { f: "l", t: "e", cs: true, v: "101" };
    const filtered = applyRuleFilter(mockEvents, rule);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].location).toBe("Room 101");
  });

  it("respects case sensitivity when cs is true", () => {
    const rule: Rule = { f: "s", t: "c", cs: true, v: "team" };
    const filtered = applyRuleFilter(mockEvents, rule);
    expect(filtered).toHaveLength(0); // Should not match 'Team Meeting'
  });

  it("ignores case when cs is false", () => {
    const rule: Rule = { f: "s", t: "c", cs: false, v: "team" };
    const filtered = applyRuleFilter(mockEvents, rule);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].summary).toBe("Team Meeting");
  });

  it("handles case sensitivity with equals", () => {
    const ruleCaseSensitive: Rule = {
      f: "d",
      t: "=",
      cs: true,
      v: "team lunch",
    };
    const ruleIgnoreCase: Rule = { f: "d", t: "=", cs: false, v: "team lunch" };

    const filteredSensitive = applyRuleFilter(mockEvents, ruleCaseSensitive);
    expect(filteredSensitive).toHaveLength(0); // Should not match 'Team lunch'

    const filteredIgnoreCase = applyRuleFilter(mockEvents, ruleIgnoreCase);
    expect(filteredIgnoreCase).toHaveLength(1);
    expect(filteredIgnoreCase[0].description).toBe("Team lunch");
  });
});

describe("applyRulesFilters", () => {
  it("applies multiple rules (1)", () => {
    const rules: Rule[] = [
      { f: "s", t: "c", cs: true, v: "Team Meeting" },
      { f: "l", t: "c", cs: true, v: "Cafeteria" },
    ];
    const filtered = applyRulesFilters(mockEvents, rules);
    expect(filtered).toHaveLength(2);
    expect(filtered[0].summary).toBe("Team Meeting");
    expect(filtered[1].location).toBe("Cafeteria");
  });

  it("applies multiple rules (2)", () => {
    const rules: Rule[] = [
      { f: "s", t: "c", cs: true, v: "Team Meeting" },
      { f: "l", t: "s", cs: true, v: "Veteri" },
    ];
    const filtered = applyRulesFilters(mockEvents, rules);
    expect(filtered).toHaveLength(2);
    expect(filtered[0].summary).toBe("Team Meeting");
    expect(filtered[1].location).toBe("Veterinary Clinic");
  });
});
