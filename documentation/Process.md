# Development Process
===
### Base Rule
##### "Keep the master branch stable at all times, please"
<br><br>

### Adding New Features
This workflow is an adaptation of the [GitHub](https://guides.github.com/introduction/flow/index.html) flow.

1. Create a new Issue, and get it assigned to you.
	- e.g. Add a new issue with name: `Add Student List to Menu Bar`
	<br><br>
	
2. Start a new branch named `Feature-{IssueNumber}-{some-keywords}`. 
	- If you are already working in a branch, remember to switch to the master before creating the new 
branch. 
<br>e.g.	`Feature-42-AddStudentListsMenuBar`
	<br><br>
	
	```
	//switch to master (if not already on the master)
	git checkout master
	//create new branch and switch to it at the same time e.g. git checkout -b 2342-remove-println
	git checkout -b {branch-name}
	```
	<br><br>
3. Push the branch to the repo so that the other people in our team know that you are working on your genius idea!
	<br>	
	`git push origin {branch-name}:{branch-name}`
	<br><br>
4. Implement the feature. <br>
	- Currently we are not doing code reviewing, PLEASE write possible test cases before implementing the feature.
	<br><br>
	- <b>Sync with the committer repo frequently</b>: While you were working on the new feature or the issue, others might have pushed new code to the master branch. In that case, update your repo's master branch with any new changes from remote repo and merge those updates to the branch you are working on.
	<br><br>

	```
	//switch to master and sync with committer repo
	git checkout master
	git pull origin master       
	//merge updates into working branch
	git checkout {branch-name}
	git merge master
	```
5. Finish Implementing and Merge to Master
	- Get latest master branch
	
	- RUN TEST, make sure all the tests cases (For both the new feature and the existing features) are passed
	
	- Merge locally first
	
	- If there is no conflict, push to the remote repo (yahooo~)

### Fixing Issues (Bugs)
1. Refer to "Add New Features" section except for when creating a new branch. In that case, name the branch as `Bug-{IssueNumber}-{SomeKeywords}` e.g. `Bug-42-FixStudentList`


2. The rest follows the procedures in "Add New Features".


### Merge Branch
1. Currently we are not planning to do code reviewing, therefore run all existing test cases before merging to master branch.