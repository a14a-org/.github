module.exports = {
  platform: "github",
  autodiscover: true,
  // Only repos that already carry .github/renovate.json are processed. No new
  // onboarding PRs: a repo joins Renovate by merging its config on purpose.
  onboarding: false,
  requireConfig: "required",
  onboardingConfigFileName: ".github/renovate.json",
  onboardingConfig: {
    $schema: "https://docs.renovatebot.com/renovate-schema.json",
    extends: ["github>a14a-org/.github"],
  },
  branchPrefix: "chore/renovate-",
};
