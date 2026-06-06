# Security Policy

## Scope

This repository contains a **dataset** (camera specifications), not executable software. There are no authentication systems, no user data, and no network services to attack.

"Security" in this project means two things:

1. **Data accuracy** — incorrect specs could lead someone to deploy the wrong camera for their use case
2. **Supply chain** — the build tooling (`scripts/`, `package.json`) should not introduce malicious code

---

## Reporting a data error

If you find a specification that is wrong, outdated, or fabricated:

**Preferred:** [Open a correction issue](../../issues/new?template=correction.yml) — it's a short form, no clone required.

**Alternative:** Edit the JSON file directly, run `npm run build`, and open a pull request.

Please include a source URL (manufacturer datasheet or reputable retailer) so the correction can be verified.

---

## Reporting a vulnerability in the build tooling

If you find a security issue in `scripts/build.js`, `scripts/add-camera.js`, or any other code in this repo (e.g. a path traversal in the build script, a dependency with a known CVE):

**Please do not open a public issue.**

Instead, use [GitHub's private vulnerability reporting](../../security/advisories/new) (Security → Advisories → Report a vulnerability).

We aim to acknowledge reports within 48 hours and resolve confirmed issues within 14 days.

---

## Dependencies

This project has no runtime dependencies. The only development dependency is `ajv` (JSON schema validation), used only during `npm run build`. Keep it updated with `npm audit`.

---

## Data provenance

All camera entries include a `sources` array with URLs to manufacturer datasheets or reputable retailer listings. If a `sources` field is empty or missing, treat the entry as unverified.
