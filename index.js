const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
  const name = 'PR Required Tasks';

  try {
    const token = core.getInput('token', { required: true });
    const body = github.context.payload.pull_request?.body

    const incompleteTasks = body.includes("- [ ] <!-- required task -->")

    console.log({ body, incompleteTasks });
    console.log({ conclusion: incompleteTasks ? 'failure' : 'success', });

    const ocotkit = github.getOctokit(token)

    await ocotkit.checks.create({
      name,
      head_sha: github.context.payload.pull_request?.head.sha,
      status: 'completed',
      conclusion: incompleteTasks ? 'failure' : 'success',
      completed_at: new Date().toISOString(),
      output: {
        title: name,
        summary: incompleteTasks ? 'Some required tasks are incomplete ❌' : 'All required tasks complete ✅',
      },
      owner: github.context.repo.owner,
      repo: github.context.repo.repo
    })

  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
