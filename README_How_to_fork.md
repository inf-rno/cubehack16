######################################
# GERRIT CONFIGURATION
######################################

The project repo must be configure with those access in order to be able to push the initial fork:
 - Allow Forge Author Identity
 - Allow Forge Commiter Identity
 - Allow Push
 - Allow Push Merge Commit

######################################
# Configure a new fork
######################################

# Clone the project repo
    git clone ssh://<username>@partners.macadamian.com:29418/<new_fork_repo>
    cd <new_fork_repo>
    scp -p -P 29418 <username>@partners.macadamian.com:hooks/commit-msg .git/hooks/

# Add the boilerplate repo as an new remote
    git remote add boilerangularloop ssh://<username>@partners.macadamian.com:29418/m21lab-boilerangularloop

# we are on origin/master of the <new_fork_repo> repo

# fetch latest version of the boiler plate project
    git fetch boilerangularloop 

# merge the boilerangularloop's master branch in the new <new_fork_repo>
    git merge boilerangularloop/master

# push the merge commit (and all the other commits) to the <new_fork_repo>
    git push origin master
