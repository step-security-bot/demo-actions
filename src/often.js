module.exports = async ({github, owner, repo, workflow, run_id}) => {
    
    console.log(`Beginning of workflow [${workflow}] with run_id [${run_id}]`);
    //"workflow_ref": "rajbos/demo-actions/.github/workflows/do-not-trigger-to-often.yml@refs/heads/often-test",
    let workflowParts = workflow.split('@')
    let workflow_id = workflowParts[0] // first parth before @
    workflowParts = workflow_id.split('/')
    workflow_id = workflowParts[workflowParts.length-1] // last part after last / will contain the yml name
    
    console.log(`Running on repo [${owner}/${repo}] with workflow_id: [${workflow_id}]`)
          
    try {
        console.log(`Testing 'getWorkflow' call`)

        try {
            const runs = await github.rest.actions.getWorkflow({
                owner,
                repo,
                workflow_id
            });
            console.log(`Workflow info with owner/repo[${owner}/${repo}] and workflow [${workflow_id}]`)
            console.log(`Runs: ${JSON.stringify(runs)}`)
            console.log(``)
            console.log(`Found [${runs.length}] workflow runs`)
        } catch (error) {
            console.log(`error calling 'getWorkflow' with owner/repo[${owner}/${repo}] and workflow [${workflow_id}]: ${error}`)
        }
        
        console.log(`Testing 'listWorkflowRunsForRepo' call`)
        try {
            const runs2 = await github.rest.actions.listWorkflowRunsForRepo({
                    owner,
                    repo
                },
                (response) => console.log(`Response: ${JSON.stringify(response)}`)
            )        
            console.log(`Runs2 with owner/repo: [${owner}/${repo}]: ${JSON.stringify(runs2)}`)
        }
        catch(err) {
            console.log(`err calling 'listWorkflowRunsForRepo': ${err}`)
        }

        console.log(`Testing direct 'actions/runs{run_id}' call`)
        workflow_id = '' // reset the value
        try {
            const currentRun = await github.request(
                "GET /repos/{owner}/{repo}/actions/runs/{run_id}",
                {owner, repo, run_id}
            )        
            //console.log(`Run Response: ${JSON.stringify(currentRun)}`)
            workflow_id = currentRun.data.workflow_id
            console.log(`Found workflow_id: ${workflow_id}`)
        }
        catch(err) { 
            console.log(`err with API call: ${err}`)
        }

        try {            
            const response = await github.request(
                "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
                {owner, repo, workflow_id}
            )        
            //console.log(`All runs Response: ${JSON.stringify(response)}`)

            for (let i = 0; i < response.data.workflow_runs.length; i++) {
                const run = response.data.workflow_runs[i]
                console.log(`Run ${i}: ${JSON.stringify(run.run_number)}`)
            }
        }
        catch(err) { 
            console.log(`err: ${err}`)
        }

        // const runs = await github.rest.actions.listWorkflowRuns({
        //     owner,
        //     repo,
        //     workflow_id
        // });
        
    } catch (error) {
        console.log(`error: ${error}`)
    }

    console.log(`The End`)
    return null
  }