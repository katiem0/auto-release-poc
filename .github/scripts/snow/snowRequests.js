const axios = require('axios')
const core = require('@actions/core');

async function createChangeRequest() {
  const url = `${process.env.SNOWURL}/api/sn_chg_rest/change/normal`
  const username = process.env.SNOW_USERNAME
  const password = process.env.SNOW_PASSWORD
  const auth = {
    username: username,
    password: password
  }
  const body = {
    "short_description": "pc-test",
    "description": "This is a description of the standard change request.",
    "assignment_group": "assignment_group_sys_id",
    "requested_by": "requested_by_user_sys_id"
  }
  try {
  const response = await axios.post(url, body, { auth })
  console.log(`Created request: ${response.data.number.display_value}`)
  core.setOutput('sys_id', response.data.number.sys_id.value);
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function waitForApproval() {
  const url = `${process.env.SNOWURL}/api/sn_chg_rest/change/normal/${process.env.sys_id}`
  const username = process.env.SNOW_USERNAME
  const password = process.env.SNOW_PASSWORD
  const auth = {
    username: username,
    password: password
  }
  try {
    while (response && response.data.result.state.value !== '3') {
      console.log(`Request state: ${response.data.result.state.display_value}`)
      await new Promise(r => setTimeout(r, 5000));
      response = await axios.get(url, { auth })
    }
    core.setOutput('state', response.data.result.state.approval_history.display_value);
  } catch (error) {
    core.setFailed(error.message);
  }
}
module.exports = {createChangeRequest, waitForApproval}
