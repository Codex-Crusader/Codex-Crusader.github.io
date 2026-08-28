// How a repository is typed in the JSON-LD, resolved in one place.
//
// The front page and the charter both publish a node for the same repository,
// under the same @id, and that only holds together while they agree about what
// the thing IS. Two copies of this logic would agree on the day they were
// written and drift on the day one of them was edited, so there is one.
//
// Every repository is SoftwareSourceCode: that is what a repository is. A
// repository named in profile.github.applications is ALSO a SoftwareApplication,
// and takes both types on one node rather than being split into two nodes. The
// existing rule stands and this does not weaken it: claiming that every repo is
// an application would be false for most of them, which is why the list is a
// short hand-kept one rather than something inferred from topics.

import profile from './profile.js';

const apps = profile.github.applications ?? {};

export function isApplication(repoName) {
  return Object.prototype.hasOwnProperty.call(apps, repoName);
}

/**
 * The @type for a repository's node: a bare string for source, an array when
 * the thing is also an application. A one-element array would be valid JSON-LD
 * and noisier to read, so the common case stays a string.
 */
export function typeFor(repoName) {
  return isApplication(repoName)
    ? ['SoftwareSourceCode', 'SoftwareApplication']
    : 'SoftwareSourceCode';
}

/**
 * The application-only properties, and nothing when the repo is not one. Each
 * field is omitted rather than guessed: a category is stated where it is
 * genuinely known, and operatingSystem only where the project actually names a
 * platform. Everything under this account is free and MIT licensed, which is a
 * claim the repositories themselves make, so the offer is safe to publish.
 */
export function applicationProps(repoName) {
  const app = apps[repoName];
  if (!app) return {};
  return {
    ...(app.category ? { applicationCategory: app.category } : {}),
    ...(app.os ? { operatingSystem: app.os } : {}),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}
