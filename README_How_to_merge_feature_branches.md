######################################
# Merge feature branch into your repo
######################################

# Fetch all remotes (which includes boilerangularloop if you forked the project as mentioned in README_How_to_fork.md)

- git fetch —all


# To list the feature branches

- git branch


# Merge the feature you want to include

- git merge --no-ff boilerangularloop/feature_NAME


# Fix any merge conflicts regarding your needs e.g.: you will get some merge conflicts regarding bower.json/package.json new packages

# If your merge had conflicts and you had to resolve them:

- git commit 

# Directly push the merge to your repo
# NOTE: We need to push directly because merge does not assign commit id and will cause gerrit to create reviews which we don't want at this point

git push origin local_branch:your_project_remote_branch

where:
 local_branch: name of the branch you locally work on
 your_project_remote_branch: the branch you target in the repo, usually master
