const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
  try {
    const body = github.context.payload.pull_request?.body

    const incompleteTasks = body.includes("- [ ] <!-- required task -->")

    if (incompleteTasks) {
      core.setFailed('Some required tasks are incomplete ❌')
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
