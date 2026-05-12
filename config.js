module.exports = {
  platform: "github",
  autodiscover: true,
  onboarding: true,
  onboardingConfigFileName: ".github/renovate.json",
  onboardingConfig: {
    $schema: "https://docs.renovatebot.com/renovate-schema.json",
    extends: ["github>a14a-org/.github"],
  },
  branchPrefix: "chore/renovate-",
};
