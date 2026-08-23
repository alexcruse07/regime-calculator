---
name: AWS Deployment
description: Document and guide static deployment of the Indian Income Tax Calculator to AWS.
---

# AWS Deployment Skill

Use this skill when planning or reviewing how the static Indian Income Tax Calculator would be deployed to AWS.

## Target Architecture

User  
→ CloudFront  
→ S3

The initial deployment model is a static site hosted as files in S3 and served through CloudFront.

## Core Principle

Keep deployment simple, static, and least-privilege.

Do not create AWS resources in this skill.
Do not deploy anything from this skill.
Do not include real credentials.

## 1. Production Build

- The application should be built into static production assets before deployment.
- Verify that the build output contains the expected HTML, CSS, JavaScript, and supporting files.
- Confirm that the production output is suitable for upload to S3.
- Do not deploy source files directly unless the project explicitly requires it.

## 2. S3 Bucket

- Use S3 as the origin and storage location for static assets.
- Store only the files needed to serve the web application.
- Keep the bucket structure simple and predictable.
- Avoid storing secrets or non-public data in the bucket.

## 3. Static Assets

- Upload only the compiled static site assets.
- Include assets required for page rendering, styling, and client-side behavior.
- Verify that asset paths work correctly after deployment.
- Confirm that the site can load without backend dependencies.

## 4. Bucket Configuration

- Configure the bucket for static asset delivery.
- Ensure permissions expose only the intended public content.
- Avoid overbroad read/write access.
- Prevent unintended files, backups, or environment data from being accessible.

## 5. CloudFront

- Use CloudFront in front of S3 for content delivery.
- Serve the static site over HTTPS.
- Use CloudFront behaviors that match the static site needs.
- Keep caching behavior consistent with deployment expectations.

## 6. Cache Behavior

- Define cache behavior to balance freshness and performance.
- Ensure HTML and other frequently changing files are refreshed appropriately.
- Allow long-lived caching for stable hashed assets where applicable.
- Make cache strategy predictable and documented.

## 7. Cache Invalidation

- Plan cache invalidation for updates to the deployed site.
- Invalidate changed content when users must see new versions immediately.
- Avoid unnecessary invalidations when cache-busting asset names are used.
- Confirm that invalidation strategy matches the release process.

## 8. Deployment Verification

- Verify that the uploaded files are present in S3.
- Verify that CloudFront serves the expected version of the site.
- Confirm that the site loads successfully in a browser.
- Confirm that static assets resolve correctly and no unexpected errors appear.

## 9. IAM Least Privilege

- Grant only the permissions required for upload, invalidation, and bucket access.
- Separate deployment permissions from unrelated AWS access.
- Avoid wildcard permissions where narrower permissions are sufficient.
- Review IAM roles and policies before use.

## 10. AWS Credentials Safety

- Never store real AWS credentials in source code or documentation.
- Never paste access keys, secret keys, or session tokens into files.
- Use short-lived, least-privilege credentials when deployment tooling requires AWS access.
- Treat all deployment secrets as sensitive.

## 11. Rollback Considerations

- Keep a clear path to restore a previous known-good version.
- Be able to re-upload or re-point deployment artifacts if a release is broken.
- Keep deployment changes small enough to identify the failing release quickly.
- Document how to revert to the last stable static asset set.

## Practical Guidance for Developers

- Build the static site first.
- Upload only the built assets.
- Verify that asset references work through CloudFront.
- Keep permissions narrow.
- Plan invalidation and rollback before changing deployment steps.

## Practical Guidance for Reviewers

- Confirm the deployment target is still static S3 + CloudFront.
- Confirm the bucket does not expose unwanted data.
- Confirm cache behavior matches the asset strategy.
- Confirm credentials are not committed.
- Confirm IAM permissions are least privilege.
- Confirm rollback is possible.

## Common Mistakes

- Deploying source instead of build output.
- Making the bucket more public than needed.
- Forgetting cache invalidation for HTML updates.
- Overusing broad IAM permissions.
- Including secrets in docs or config.
- Assuming CloudFront caching will always show the latest version.

## Deployment Checklist

- Production build completed successfully.
- Static assets verified.
- S3 bucket contains only the intended site files.
- CloudFront serves the site correctly.
- Cache behavior is documented.
- Invalidation strategy is defined.
- IAM access is least privilege.
- No real credentials are committed.
- Rollback path is understood.

## Implementation Reminder

This skill is for deployment guidance only.
Do not create AWS resources here.
Do not deploy anything here.
