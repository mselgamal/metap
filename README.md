# metap 

metaps stands "me" + "tool for auto provisioning", Cisco phone service. when configured on auto registered phones. The service allows users
to enter designated phone directory number and a phone profile is matched to the auto-registered phone. 

metaps accomplishes the following:
- phone profiles are be uploaded using dummy addresses prior to deployment
- shared line support
- eliminates mac address scanning 
- eliminates physical phone association with end user prior to deployment

phones supported:
- 7900, 7800, 8800

## Getting Started

- clone repo
- create a .env file, using .env-sample as base
- install dependencies in package.json file

### Prerequisites

- install latest version of git
- install latest version of nodejs
- CUCM version 11.x

### Installing

- [install nodejs](https://nodejs.org/en/download/)
- [install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Deployment

- install prerequisites
- git clone https://github.com/mselgamal/metap.git
- install dependencies:
	- go to repo folder
	- run "npm install --save"
- create .env file, copy .env-sample content to .env and change parameters if needed.
- start server:
	- npm start
	- enter axl user creds
- Create phone service in cucm:
	- url, http://insert_server_addr:enter_server_port/tap/menu?name=#DEVICENAME#
- assign phone service to auto registered phone template
- enable auto registration on cucm

## Verify Service is up

- go to browser
- type http://insert_server_addr:enter_server_port/tap/menu?name=#DEVICENAME#
- XML menu should display

## Built With

* [NodeJS](http://www.nodejs.com) - The web framework used

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Mamdouh Elgamal** 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
