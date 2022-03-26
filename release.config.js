module.exports = {
  branches: [
    "master",
    { name: "beta", prerelease: true },
    { name: "alpha", prerelease: true },
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/exec",
      {
        publishCmd:
          process.env["GITHUB_OUTPUTS"] === "true"
            ? 'echo "::set-output name=tag::${nextRelease.gitTag}"'
            : "",
      },
    ],
  ],
};
