# metap

metap stands "me" + "tool for auto provisioning", Cisco phone service. when configured on auto registered phones. The service allows users
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

## Prerequisites

- install latest version of git
- install latest version of nodejs
- CUCM version 11.x, 10.x, 9.x

## Installing

- [install nodejs](https://nodejs.org/en/download/)
- [install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Deployment

- install prerequisites
- open cli:
	- go to root folder where repo would reside
	- run git clone https://github.com/mselgamal/metap.git
- install dependencies:
	- go to repo folder
	- run "npm install --save"
- create .env file:
	- copy .env-sample content to .env and change parameters. 
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

## Understanding .env variables

#### HTTP_PORT=8082: 			default server http port, port used by CUCM for http requets
#### HTTPS_PORT=443				default server https port, port used by CUCM for https requets
#### CUCM_PORT=8443				https port used by metaps to make AXL requests, This is a static field DO NOT CHANGE unless certain it's different
#### CUCM_HOST=10.0.0.2			ip address used by metaps to make AXL requests, change to match your CUCM address
#### CUCM_VER=11.0				default call manager version, for XX.X version enter XX.0 i.e 11.5 -> 11.0
#### NODE_ENV=production		specifies metaps enviroment, default is production
#### SERVER_ADDR=10.0.0.1		default metaps address, change to match host server address
#### DN_PT=Cluster_DN			default DN partition where internal DNs exist, ONLY SINGLE PARTITION is supported
#### AXL_API_PATH=/axl/			default axl api url path, DO NOT CHANGE unless certain its different
#### E164_DN=false				change to true if DNs are configured as  \+XXXXXXXXXX, E164 format
#### DEV_DESC_ST=0				The description displayed on phone after submitting extension is max 64 chars, but description is originally 									copied from CUCM, where max is 128 chars. by defaut only 0 -> 64 chars are copied


## Built With

* [NodeJS](http://www.nodejs.com) - The web framework used

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Mamdouh Elgamal**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
