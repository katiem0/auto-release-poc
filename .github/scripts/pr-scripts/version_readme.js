module.exports = async ({github, context, core}) => {
  const { readdir, readFile, writeFile } = require('fs').promises;
  const utf8 = { encoding: 'utf-8' };
  const { number: issue_number } = context.issue;
  const readText = (name) => readFile(name, utf8).then(x => x.trim());

  const changelog = await readText(`output/artifact/changelog.md`);
  const beginIssue = `<!-- BEGIN_CHANGELOG_FROM_${issue_number} -->`;
  const header = `${beginIssue}\r\n### Version ${process.env.releaseversion}\r\n\r\n#### ${process.env.changetype}`;
  const newLog = `${header}\r\n\r\n${changelog}\r\n<!-- END_CHANGELOG_FROM_${issue_number} -->`;

  const readme = await readText(`src/README.md`);
  const changelogmd = await readText(`src/CHANGELOG.md`);
  const validReadme = readme.includes(beginIssue);
  const validChangleog = changelogmd.includes(beginIssue);

  let newReadme;
  let newChangelog;
  const regexReplace = new RegExp(`(<!-- BEGIN_CHANGELOG_FROM_${issue_number} -->)[\\s\\S]*?(<!-- END_CHANGELOG_FROM_${issue_number} -->)`);
  
  if (validReadme) {
    console.log('An existing changelog release for this PR is logged to the README.');
    newReadme = readme.replace(regexReplace, `${newLog}`);
  } else {
    console.log('No existing changelog release was committed to the README for this PR.')
    newReadme = readme.replace(/(<!-- BEGIN_CHANGELOG_ACTION -->)/, `$1\r\n\r\n${newLog}`);
  }
  if (validChangleog) {
    console.log('An existing changelog release for this PR is logged to the CHANGELOG.');
    newChangelog = changelogmd.replace(regexReplace, `${newLog}`);
  } else {
    console.log('No existing changelog release was committed to this CHANGELOG for this PR.')
    newChangelog = changelogmd.replace(/(<!-- BEGIN_CHANGELOG_ACTION -->)/, `$1\r\n\r\n${newLog}`);
  }
  
  await writeFile('output/README.md', newReadme, { encoding: 'utf-8' });
  await writeFile('output/CHANGELOG.md', newChangelog, { encoding: 'utf-8' });
}