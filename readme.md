# Developing a Video KYC Web App with Node.js and EnableX Web Toolkit

Coding a Video KYC Web App: Node.js & EnableX Web Toolkit 

See our Sample Web App showcasing EnableX APIs for a basic Video KYC solution. This app helps developers learn API usage and host it on their devices, avoiding server dependencies. It runs smoothly on supported web browsers, no plugins needed. Developed with HTML, CSS, Bootstrap, JavaScript, jQuery, Node.js, and EnxRtc (EnableX Web Toolkit). 

>The details of the supported set of web browsers can be found here:
https://developer.enablex.io/video/browser-compatibility-of-enablex-video/

## 1. Important!

When developing a Client Application with EnxRtc.js ( present in client/js ), make sure to replace the old EnxRtc.js with updated EnxRtc.js polyfills from https://developer.enablex.io/video-api/client-api/web-toolkit/ for RTCPeerConnection and getUserMedia. Otherwise your application will not work in web browsers.


## 2. Trial

Sign up for a free trial https://portal.enablex.io/cpaas/trial-sign-up/ or try our multiparty video chat https://try.enablex.io/


## 3. Installation

### 3.1 Pre-Requisites

#### 3.1.1 App Id and App Key

* Create a free account on EnableX [https://portal.enablex.io/cpaas/trial-sign-up/]
* Create your Project
* Get the App ID and App Key generated against the Project
* Clone this repository `git clone https://github.com/EnableX/Video-KYC-Webrtc-Application-Sample-for-Web.git --recursive` & follow the steps further 
* You can copy the app into any sub-directory of hosted website on Apache

#### 3.1.2 SSL Certificates

The Application needs to run on https. So, you need to use a valid SSL Certificate for your Domain and point your application to use them.

However you may use self-signed Certificate to run this application locally. There are many Web Sites to get a Self-Signed Certificate generated for you, Google it. Few among them are:

* https://letsencrypt.org/
* https://www.sslchecker.com/csr/self_signed
* https://www.akadia.com/services/ssh_test_certificate.html  

As you have Certificate or created a Self-Signed Certificate, create a directory "certs" under your Sample Web App Directory. Copy your Certificate files (.key and .crt files)  to this directory.

The following below can also be used to create a self-signed certificate.

 Linux/Mac
```javascript
  cd Video-KYC-Webrtc-Application-Sample-for-Web
  mkdir certs
  sudo openssl req -x509 -newkey rsa:4096 -keyout ./certs/example.key -out ./certs/example.crt -days 10000 -nodes
  sudo chmod 755 ./certs/example.*
  cd ..
```
Windows(Use Git Bash)
```javascript
  cd Video-KYC-Webrtc-Application-Sample-for-Web
  mkdir certs
  openssl req -x509 -newkey rsa:4096 -keyout ./certs/example.key -out ./certs/example.crt -days 10000 -nodes
  chmod 755 ./certs/example.*
  cd ..
```
#### 3.1.3 Configure

Before you can run this application, configure the service by editing `server/vcxconfig.js` to meet project requirement:
```javascript 
  vcxconfig.SERViCE = {
    name: "Video KYC POC",     // Name of the Application [Change optional]
    version: "1.0.0",                   // Version [Change optional]
    path: "/v1",                        // Route [Default /v1]
    domain: "localhost",           // FQDN of  your hosting enviornment
    port  : "4443",                     // FQDN of  your hosting port. You need sudo permission if you want to use standard 443
    listen_ssl : true                   // SSL on/off key  [ Set always to "true" ]
  };

  vcxconfig.Certificate = {
    ssl_key:      "../certs/example.key",  // Use the certificate ".key" [self signed or registered]
    ssl_cert :    "../certs/example.crt",  // Use the certificate ".crt" [self signed or registered]
    sslCaCerts :  null                        // Use the certificate CA[chain] [self signed or registered]
  };

  vcxconfig.SERVER_API_SERVER = {
    host: 'api.enablex.io',             // Hosted EnableX Server API Domain Name
    port: '443'
  };

  vcxconfig.clientPath  = "../client";    // UI files location
  vcxconfig.APP_ID      = "YOUR_APP_ID";  // Enter Your App ID
  vcxconfig.APP_KEY     = "YOUR_APP_KEY"; // Enter Your App Key
```

### 3.2 Build

Run `npm install --save` to build the project and the build artifacts will be stored in the `./node_modules` directory.

#### 3.2.1 Run Server

Run `node server.js` inside `server` folder for starting your Server. 

```
  - cd server
  - node server.js

```


#### 3.2.2 Test 

* Open a browser and go to [https://localhost:4443/](https://localhost:4443/). The browser should load the App. 
* Allow access to Camera and Mic as and when prompted to start your first RTC Call through EnableX


## 4. Server API

EnableX Server API is a Rest API service meant to be called from Partners' Application Server to provision video enabled
meeting rooms. API Access is given to each Application through the assigned App ID and App Key. So, the App ID and App Key
are to be used as Username and Password respectively to pass as HTTP Basic Authentication header to access Server API.

For this application, the following Server API calls are used:
* https://developer.enablex.io/video-api/server-api/rooms-route/#create-room - To create room to carry out a video session
* https://developer.enablex.io/video-api/server-api/rooms-route/#create-token - To create Token for the given Room to join a session

To know more about Server API, go to:
https://developer.enablex.io/video-api/server-api/


## 5. Client API

Client End Point Application uses Web Toolkit EnxRtc.js to communicate with EnableX Servers to initiate and manage RTC Communications.

To know more about Client API, go to:
https://developer.enablex.io/video-api/client-api/
