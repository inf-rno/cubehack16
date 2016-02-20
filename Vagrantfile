Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.provider "virtualbox" do |v|
    v.memory = 2048
    v.cpus = 1
  end

  # port forwarding for the api server
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  # port forwarding for the client app
  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.network "forwarded_port", guest: 443, host: 4433


  # disable default virtualbox shared folder
  config.vm.synced_folder ".", "/vagrant", disabled: true
  # use rsync instead
  config.vm.synced_folder '.', '/vagrant', type: 'rsync',
    rsync__exclude: [".git/", ".idea/", ".vagrant/", "**/node_modules/", "**/libs/", "**/bower_components/"],
    rsync__verbose: true

  # provision docker
  config.vm.provision :docker
  # provision docker-compose, build and run the application
  config.vm.provision :docker_compose, compose_version:"1.6.0", rebuild: "true", run: "always", 
    yml: [
      "/vagrant/docker-compose.yml",
      "/vagrant/docker-compose.override.yml"
    ]
end