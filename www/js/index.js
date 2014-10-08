/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        console.log("init");
        if (!localStorage.topics) {
            localStorage.topics = [];
        }
        this.bindEvents();
        //$.support.cors;
        //$.mobile.allowCrossDomainPages;
    },
    
        
    registerAndroidNotifications: function() {
        console.log("registering android notifs");
        var pushNotification = window.plugins.pushNotification;
        pushNotification.register(app.notifSuccess,
                                  app.notifError,
                                  {"senderID":"867512734067","ecb":"app.onNotification"});
        console.log("registered notifs");
    },
    
    registerIosNotifications: function() {
        console.log("registering ios notifs");
        var pushNotification = window.plugins.pushNotification;
        pushNotification.register(app.onIosToken, app.notifError, {
            "badge":"true",
            "sound":"true",
            "alert":"true",
            "ecb":"app.onNotificationAPN",
        });
        console.log("registered notifs");
    },
    
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        console.log("bind");
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log("devready");
        app.receivedEvent('deviceready');
        console.log("registering...");
        console.log("registered!");
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Receeived Event:' + id);
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
        if (id === 'deviceready') {
            console.log("getting phone num");
            var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
            telephoneNumber.get(function(result) {
              console.log("result = " + result);
            }, function() {
                console.log("error");
            });
            if (device.platform == 'android' ||
                device.platform == 'Android' ||
                device.platform == 'amazon-fireos' ) {
                this.registerAndroidNotifications();
            } else {
                this.registerIosNotifications();
            }
            if (app.onDevReady) {
                app.onDevReady();
            }
        }
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');
    },
    
    addTopic: function(topic, onDone) {
        var postData = app.initPostRequest();
        if (!postData) {
            console.log("no ID, can't subscribe to:" + topic);
            onDone(1);
            return;
        }
        postData["topic"] = topic;
        console.log("POSTING:" + topic);
        $.post("http://www.bbrennan.info/posted/subscribeMobile", postData, function(resp) {
           console.log("SUBSCRIBE response:" + resp);
           onDone();
        });
    },
    
    notifSuccess: function() {
        console.log("notifSuccess");
    },
    
    notifError: function(err) {
        console.log("notifError:" + err);
    },
    
    onIosToken: function(token) {
        console.log("IOS TOKEN:" + token);
        localStorage.iosId = token;
    },
    
    // handle APNS notifications for iOS
    onNotificationAPN: function(e) {
        if (e.alert) {
            console.log('push-notification: ' + e.alert);
        }
                    
        if (e.sound) {
            // playing a sound also requires the org.apache.cordova.media plugin
            var snd = new Media(e.sound);
            snd.play();
        }
                
        if (e.badge) {
            pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
        }
    },
    
    onNotification: function(e) {
        switch( e.event ) {
            case 'registered':
                console.log("registerd");
                if ( e.regid.length > 0 ) {
                    console.log("Regid " + e.regid);
                    console.log('registration id = '+e.regid);
                    localStorage.androidId = e.regid;
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              console.log('message = '+e.message+' msgcnt = '+e.msgcnt);
              console.log("EXTRA:" + e.payload.extra);
              if (e.foreground) {
                  
              } else {
                window.open(e.payload.extra, '_system');
              }
            break;
 
            case 'error':
              console.log('GCM error = '+e.msg);
            break;
 
            default:
              console.log('An unknown GCM event has occurred');
              break;
        }
    },
    
    initPostRequest: function() {
        var data = {uuid: window.device.uuid};
        if (device.platform == 'android' ||
            device.platform == 'Android' ||
            device.platform == 'amazon-fireos' ) {
            if (!localStorage.androidId) {
                return;
            }
            data["androidId"] = localStorage.androidId;
        } else {
            if (!localStorage.iosId) {
                return;
            }
            data["iosId"] = localStorage.iosId;
        }
        console.log("POSTDATA:" + JSON.stringify(data));
        return data;
    }
};
