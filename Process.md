# Development Process
===
### Base Rule
##### "Keep the master branch stable at all times, please"
<br><br>

### Adding New Features
This workflow is an adaptation of the [GitHub](https://guides.github.com/introduction/flow/index.html) flow.

1. Create a new Issue, and get it assigned to you.
	- e.g. `Add Student List to Menu Bar`
	<br><br>
	
2. Start a new branch named `Feature-{IssueNumber}-{some-keywords}`. 
	- If you are already working in a branch, remember to switch to the master before creating the new 
branch. e.g.	`Feature-42-AddStudentListsMenuBar`
	
	```
	//switch to master (if not already on the master)
	git checkout master
	//create new branch and switch to it at the same time e.g. git checkout -b 2342-remove-println
	git checkout -b {branch-name}
	```
	<br><br>
	
3. Implement the feature. <br>
	- Currently we are not doing code reviewing, PLEASE write possible test cases before implementing the feature.
	- Sync with the committer repo frequently: While you were working on the new feature the issue, others might have pushed new code to the committer repo. In that case, update your repo's master branch with any new changes from committer repo and merge those updates to the branch you are working on.

	```
	//switch to master and sync with committer repo
	git checkout master
	git pull upstream master       
	//merge updates into working branch
	git checkout {branch-name}
	git merge master
	```


### Fixing Issues (Bugs)
1. Refering to "Add New Features" section, when creating a new branch, name the branch as `Bug-{IssueNumber}-{SomeKeywords}` e.g. `Bug-42-FixStudentList`


2. The rest follows the procedures on adding new features


### Merge Branch
1. Currently we are not planning to do code reviewing, therefore run existing all tests cases before merging to master branch.