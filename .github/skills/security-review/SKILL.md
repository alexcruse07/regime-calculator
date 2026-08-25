---
name: Security Review
description: Review client-side, dependency, and deployment security risks for the static Indian Income Tax Calculator.
---

# Security Review Skill

Use this skill when reviewing or implementing security-sensitive changes in the Indian Income Tax Calculator.

This skill is intended to guide both Developer and Reviewer agents.

## Core Principle

Prefer the simplest secure approach.

Do not introduce secrets, unsafe DOM patterns, or unnecessary attack surface.

## 1. Secrets

- Never commit secrets to the repository.
- Do not hard-code passwords, tokens, private keys, or session values.
- Do not store secrets in frontend code, static assets, or committed configuration files.
- Treat any value that authenticates access as sensitive.

## 2. API Keys

- Do not embed API keys in client-side code unless the architecture explicitly allows a public, non-sensitive key and the risk is understood.
- Verify whether a key can be public before using it.
- Prefer no key at all for a static calculator unless a requirement explicitly needs one.
- Never assume a key is safe just because it is in the browser.

## 3. AWS Credentials

- Never commit AWS access keys, secret keys, or session tokens.
- Do not put long-lived AWS credentials in source code, documentation, or static assets.
- Use short-lived, least-privilege access when AWS interaction is required.
- Do not expose deployment credentials to the client.

## 4. Unsafe DOM Manipulation

- Avoid inserting untrusted text into the DOM with unsafe patterns.
- Prefer text-safe rendering over HTML injection.
- Treat all user input as untrusted.
- Be cautious with any code that updates the page using raw HTML strings.

## 5. XSS

- Prevent cross-site scripting by sanitizing or escaping untrusted content before display.
- Never render user-entered values as executable HTML or script.
- Avoid using dynamic HTML injection when plain text rendering is sufficient.
- Review any template or rendering helper that may interpret markup.

## 6. Dependency Risks

- Avoid unnecessary dependencies.
- Review third-party packages for maintenance, popularity, and purpose.
- Prefer built-in browser APIs and small utilities where possible.
- Be cautious of packages that add attack surface without a clear benefit.
- Keep dependency updates deliberate and reviewed.

## 7. Client-Side Security

- Assume all frontend code is visible to users.
- Do not place sensitive business rules or secrets in the client unless they are meant to be public.
- Validate and sanitize inputs before use.
- Keep client-side storage limited and intentional.
- Do not rely on frontend checks as the only security boundary.

## 8. S3 Security

- Do not use public buckets unless the static site requires public read access and the exposure is intentional.
- Avoid overbroad bucket permissions.
- Review bucket policy and object access carefully.
- Ensure only the intended static assets are exposed.
- Do not store sensitive data in S3 assets intended for public delivery.

## 9. CloudFront Security

- Use CloudFront to front public static assets when appropriate.
- Verify that only the expected origin is exposed.
- Avoid caching sensitive content.
- Ensure HTTPS is used for delivery.
- Review behaviors, origins, and access controls when deployment settings are defined.

## 10. IAM Least Privilege

- Grant only the permissions needed for the task.
- Avoid wildcard permissions where narrower access is possible.
- Separate deployment permissions from unrelated AWS access.
- Review IAM roles, policies, and trust relationships carefully.

## 11. Public Bucket Risks

- Public buckets can expose unintended files, backups, or environment data.
- Review the full bucket contents before making them public.
- Do not assume public read access is safe for all objects.
- Confirm that only the static website assets are exposed.

## Practical Guidance for Developers

- Keep secrets out of code and config.
- Render user input safely.
- Prefer text output over HTML injection.
- Avoid unnecessary dependencies.
- Use least-privilege permissions for any deployment or AWS work.
- Ask before introducing any security-sensitive integration.

## Practical Guidance for Reviewers

- Check for hard-coded secrets or credentials.
- Review DOM updates for XSS risk.
- Review dependencies for unnecessary risk.
- Confirm client-side code does not expose sensitive data.
- Verify AWS-related changes follow least privilege.
- Confirm public bucket exposure is intentional and limited.

## Common Mistakes

- Committing credentials or tokens.
- Assuming client-side code is a safe place for secrets.
- Rendering untrusted content with unsafe HTML APIs.
- Adding a package when a built-in API is enough.
- Making a bucket public without checking its contents.
- Using overly broad IAM permissions.

## Security Review Checklist

- No secrets are committed.
- No unsafe HTML injection is introduced.
- No unnecessary dependencies are added.
- AWS access is least privilege.
- Public S3 exposure is intentional and limited.
- CloudFront delivery is appropriately restricted and HTTPS-based.
- User input is handled safely on the client.

## Implementation Reminder

This skill is for security review guidance only.
Do not modify application code here.
