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
        console.log("registering notifs");
        var pushNotification = window.plugins.pushNotification;
        pushNotification.register(app.notifSuccess,
                                  app.notifError,
                                  {"senderID":"867512734067","ecb":"app.onNotification"});
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
        console.log('Received Event:' + id);
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
        if (id === 'deviceready') {
            this.registerAndroidNotifications();
            if (app.onDevReady) {
                app.onDevReady();
            }
        }
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');
    },
    
    addTopic: function(topic, onDone) {
        var androidId = localStorage.androidId;
        if (!androidId) {
            console.log("no android ID, can't subscribe to:" + topic);
            return;
        }
        topic = topic.replace(/[\W\-]/g, '');
        $.post("http://www.bbrennan.info/posted/subscribeAndroid", {
            topic: topic,
            androidId: androidId,
        }, function(resp) {
           console.log("subscribe response:" + resp); 
           onDone();
        });
    },
    
    notifSuccess: function() {
        console.log("notifSuccess");
    },
    
    notifError: function() {
        console.log("notifError");
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
            break;
 
            case 'error':
              console.log('GCM error = '+e.msg);
            break;
 
            default:
              console.log('An unknown GCM event has occurred');
              break;
        }
    },
};
