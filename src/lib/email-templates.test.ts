/**
 * email-templates.test.ts
 *
 * Tests email template rendering and HTML escaping.
 *
 * Author: Alex Li
 * Date Created: 10/26/2026
 */

import {
  escapeHtml,
  renderEmail,
  applicationReceivedEmail,
  applicationApprovedEmail,
  applicationRejectedEmail,
  hourLogEditedEmail,
} from "./email-templates";

describe("escapeHtml", () => {
  it("escapes special HTML characters", () => {
    const result = escapeHtml('<script>alert("hi")</script>');

    expect(result).toBe("&lt;script&gt;alert(&quot;hi&quot;)&lt;/script&gt;");
    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
  });

  it("escapes ampersands", () => {
    expect(escapeHtml("Test & test")).toBe("Test &amp; test");
  });

  it("escapes apostrophes and quotation marks", () => {
    expect(escapeHtml(`It's "safe"`)).toBe("It&#39;s &quot;safe&quot;");
  });
});

describe("renderEmail", () => {
  it("joins paragraphs with a blank line in text", () => {
    const result = renderEmail({
      subject: "Hello",
      paragraphs: ["First paragraph", "Second paragraph"],
    });

    expect(result.text).toBe("First paragraph\n\nSecond paragraph");
  });

  it("wraps each paragraph in a p tag in HTML", () => {
    const result = renderEmail({
      subject: "Hello",
      paragraphs: ["First paragraph", "Second paragraph"],
    });

    expect(result.html).toContain("<p>First paragraph</p>");
    expect(result.html).toContain("<p>Second paragraph</p>");
    expect(result.html).toContain("<div");
    expect(result.html).toContain("max-width: 600px");
  });

  it("escapes paragraph content in HTML but not in text", () => {
    const result = renderEmail({
      subject: "Hello",
      paragraphs: ["<b>First Name</b>"],
    });

    expect(result.html).toContain("&lt;b&gt;First Name&lt;/b&gt;");
    expect(result.html).not.toContain("<b>");
    expect(result.text).toBe("<b>First Name</b>");
  });

  it("does not HTML-escape the subject", () => {
    const result = renderEmail({
      subject: "Welcome & hello",
      paragraphs: ["Hi Jane,"],
    });

    expect(result.subject).toBe("Welcome & hello");
  });
});

describe("email templates", () => {
  const templates = [
    {
      name: "applicationReceivedEmail",
      create: applicationReceivedEmail,
      subject: "We received your volunteer application",
    },
    {
      name: "applicationApprovedEmail",
      create: applicationApprovedEmail,
      subject: "Welcome to Damien's Food Pantry!",
    },
    {
      name: "applicationRejectedEmail",
      create: applicationRejectedEmail,
      subject: "Your volunteer application",
    },
  ];

  it.each(templates)(
    "$name includes the first name in text and HTML",
    ({ create }) => {
      const result = create("Jane");

      expect(result.text).toContain("Hi Jane,");
      expect(result.html).toContain("Hi Jane,");
    },
  );

  it.each(templates)(
    "$name escapes an unsafe first name in HTML only",
    ({ create }) => {
      const result = create("<b>First Name</b>");

      expect(result.text).toContain("Hi <b>First Name</b>,");
      expect(result.html).toContain("Hi &lt;b&gt;First Name&lt;/b&gt;,");
      expect(result.html).not.toContain("<b>");
    },
  );

  it.each(templates)("$name uses the exact subject", ({ create, subject }) => {
    const result = create("Jane");

    expect(result.subject).toBe(subject);
  });

  describe("hourLogEditedEmail", () => {
    it("includes changed fields and the updated entry in text and escaped HTML", () => {
      const result = hourLogEditedEmail({
        volunteerName: "<Sam Taylor>",
        changes: [
          { field: "Start time", previous: "09:00AM", updated: "09:30AM" },
        ],
        updatedEntry: {
          date: "11/18/2026",
          startTime: "09:30AM",
          endTime: "12:00PM",
          position: "Food distribution",
          notes: "<updated>",
        },
      });

      expect(result.text).toContain(
        "<Sam Taylor> has edited their hour log entry. Changed fields: Start time (09:00AM -> 09:30AM).",
      );
      expect(result.text).toContain("Updated entry:\n\nDate: 11/18/2026");
      expect(result.text).toContain("Notes: <updated>");
      expect(result.html).toContain("&lt;Sam Taylor&gt;");
      expect(result.html).toContain("&lt;updated&gt;");
      expect(result.html).not.toContain("<updated>");
    });
  });
});
