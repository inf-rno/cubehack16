-----------------------------------
INSTALL/SETUP
-----------------------------------

This will only need to be done once per machine.

TODO: write scripts for each platform to make these automatic??

1. Vagrant
    https://www.vagrantup.com/downloads.html

2. Vagrant plugins

   vagrant plugin install vagrant-docker-compose    
   vagrant plugin install vagrant-gatling-rsync
   vagrant plugin install vagrant-vbguest



WINDOWS GOTCHAs
---------------

1. Assumes you have msysGit installed and have both GitBash and GitCmd. We need to use GitCmd for rsync because it respects windows environment 
    variable hierarchy.
2. Install MinGW
    https://sourceforge.net/projects/mingw/files/Installer/
    Install all the base packages especially dev tools and msys base
3. Add MinGW binaries to user path
    Add C:\MinGW\bin and C:\MinGW\msys\1.0\bin to the top of the user PATH env variable
    TODO: Figure out a way to set the path priority for GitBash so that it will use mingw binaries instead of packaged msysGit binaries. WORKAROUND: use GitCmd for now to run rsync/vagrant up/reload
4. Vagrant might not work out of the box and you might need this VC runtime patch:
    https://www.microsoft.com/en-us/download/details.aspx?id=8328
    more info: https://stackoverflow.com/questions/34848146/vagrant-error-the-box-hashicorp-precise32-could-not-be-found-windows-10-d/34848147#34848147
5. Vagrant rsync will not work out of the box and you will need to monkey patch it. 
    Follow instructions here:
    https://github.com/mitchellh/vagrant/issues/6702#issuecomment-166503021
    TODO: remove this step when this bug is fixed.


-----------------------------------
RUN
-----------------------------------

After the first clone, do, this will install pre-push hooks:
    npm install

Using your fav terminal (see windows gotcha above) from the project root, run:
    vagrant up

This will provision an Ubuntu VM (your docker host), forward ports down to the host OS, install docker, docker-compose
and docker-cloud, setup rsync for synced folders and start watching for changes, build and run your application.

This should launch the rest server at http://localhost:3000/ and the client at http://localhost:8080/.

The project root should be synced to the /vagrant directory in the VM and the rsync watcher should be active.

-----------------------------------
DEBUG
-----------------------------------

From project root in your fav terminal:

VM/Vagrant
----------

To launch the VM 
    vagrant up

To check the status of the VM
    vagrant status

To shutdown the VM (free up RAM and paged disk)
    vagrant halt

To suspend the VM (free up RAM)
    vagrant suspend

To destoy the VM completely (free up all teh things)
    vagrant destroy

To reload the VM (after vagrantfile changes, to relaunch etc.)
    vagrant reload

To SSH into the VM
    vagrant ssh

To manually start watching files to sync (if the VM failed to properly init/reload)
    vagrant gatling-rsync-auto

To reprovision the VM (re-run all VM provisioners on a running box e.g. docker and docker-compose)
    vagrant provision

Container/Docker
----------------

Once SSHed into the VM you can run any docker commands as you would normally..

Then:

To build the application
    docker-compose build

To (re)launch the application
    docker-compose up

To check the status of the application
    docker-compose ps

To teardown the application (stop and remove containers)
    docker-compose down

To start/stop/restart a specific service
    docker-compose start/stop/restart <service-name>

To view logs (optionally filtered by service name)
    docker-compose logs <service-name>

To bash into a running container (used to debug/run tests etc.)
    docker exec -it <container-name> bash


-----------------------------------
DEPLOY
-----------------------------------

# Create an account at https://cloud.docker.com

# Create a node https://cloud.docker.com/node/cluster/list/
    Click: "Launch new node cluster"
    Create one for stage and another for prod, setting stage and app name tags

# SSH to the development VM
    vagrant ssh

# Customize ./deploy-stage.sh and run it
    Change PROJECT_NAME, REPO_NAME, REPO_EMAIL, REPO_PWD to project specific values
    Update the project name in docker-cloud.yml for all images

