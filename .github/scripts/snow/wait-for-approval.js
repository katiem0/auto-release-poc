const axios = require('axios')
const core = require('@actions/core');

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
