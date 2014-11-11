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

var server = {
  BASE_URL: "http://www.bbrennan.info/posted/", 

  initPostRequest: function() {
    var data = {};
    if (window.device) {
      data.uuid = window.device.uuid;
    }
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
    if (localStorage.phoneNumber) {
      data["phoneNumber"] = localStorage.phoneNumber;
    }
    return data;
  },

  addTopic: function(topic, onDone) {
        var postData = server.initPostRequest();
        if (!postData) {
            console.log("no ID, can't subscribe to:" + topic);
            onDone(1);
            return;
        }
        postData["topic"] = topic;
        $.post(server.BASE_URL + "subscribeMobile", postData, function(resp) {
           onDone();
        });
  },

  getTopicArticles: function(topicId, onArticles) {
    var ajaxParams = {
        type: "GET",
        url: 'http://www.bbrennan.info/posted/rss?topicId=' + topicId,
        dataType: "xml",
    };
    server.getArticlesFromRss(ajaxParams, onArticles);
  },

  getUserArticles: function(onArticles) {
    var ajaxParams = {
        type: "POST",
        url: 'http://www.bbrennan.info/posted/userRss',
        dataType: "xml",
        data: server.initPostRequest(),
    };
    server.getArticlesFromRss(ajaxParams, onArticles);
  },

  getArticlesFromRss: function(ajaxParams, onArticles) {
      ajaxParams.error = function(err) {
        onArticles([]);
      };
      ajaxParams.success = function(xml) {
        var items = $(xml).find('item');
        var ret = [];
        $(items).each(function() {
          var item = {};
          item.title = $(this).find('title').text();
          item.url = $(this).find('link').text();
          item.date = $(this).find('pubDate').text();
          item.date = new Date(item.date);
          item.timeMessage = getTimeMessage(item.date);
          item.category = $(this).find('category');
          if (item.category) {item.category = item.category.text()}
          if (item.title.toLowerCase() === 'no title') {
            item.title = item.url;
          }
          ret.push(item);
        });
        onArticles(ret);
      }
      $.ajax(ajaxParams);
  },

  deleteTopic: function(topic, onDone) {
    var postData = server.initPostRequest();
    var url = server.BASE_URL + 'deleteSubscriptionMobile';
    if (!postData) {
        console.log("no id, can't delete topic!")
        return false;
    }
    postData["topicId"] = topic;
    $.post(url, postData, function(resp) {
      onDone();
    })
  },
            
  getSubscriptions: function(onTopics) {
    var postData = server.initPostRequest();
    if (!postData) {
        return onTopics([]);
    }
    var url = server.BASE_URL + "getSubscriptionsMobile";
    $.post(url, postData, function(resp) {
        var topics = JSON.parse(resp)["subscriptions"];
        topics.sort(function(t1, t2){
           return t1.topic.toLowerCase() > t2.topic.toLowerCase() ? 1 : -1; 
        });
        onTopics(topics);
    });
  },
}

var app = {
    // Application Constructor
    initialize: function() {
        if (!localStorage.topics) {
            localStorage.topics = [];
        }
        this.bindEvents();
    },
    
        
    registerAndroidNotifications: function() {
        var pushNotification = window.plugins.pushNotification;
        pushNotification.register(app.notifSuccess, app.notifError, {
            "senderID":"867512734067",
            "ecb":"app.onNotification",
            "badge": "true",
            "alert": "false",
            "sound": "false"
        });
    },
    
    registerIosNotifications: function() {
        var pushNotification = window.plugins.pushNotification;
        pushNotification.register(app.onIosToken, app.notifError, {
            "badge":"true",
            "sound":"false",
            "alert":"false",
            "ecb":"app.onNotificationAPN",
        });
    },
    
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        if (id === 'deviceready') {
            if (device.platform == 'android' ||
                device.platform == 'Android' ||
                device.platform == 'amazon-fireos' ) {
                this.registerAndroidNotifications();
                var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
                telephoneNumber.get(function(result) {
                    localStorage.phoneNumber = result;
                }, function() {
                    console.log("error getting phone number");
                });
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
    
    notifSuccess: function() {
    },
    
    notifError: function(err) {
        console.log("notifError:" + err);
    },
    
    onIosToken: function(token) {
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
            var pushNotification = window.plugins.pushNotification;
            var successHandler = function(inpt) {
                console.log("success?" + inpt);
            };
            pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
            this.handleNotification(e);
        }
    },
    
    onNotification: function(e) {
        switch( e.event ) {
            case 'registered':
                if ( e.regid.length > 0 ) {
                    localStorage.androidId = e.regid;
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              var extra = e.payload.extra;
              this.handleNotification(extra);
            break;
 
            case 'error':
              console.log('GCM error = '+e.msg);
            break;
 
            default:
              console.log('An unknown GCM event has occurred');
              break;
        }
    },
    
    handleNotification: function(extra) {
      ons.tabbar.setActiveTab(0);
    },
    
    openUrl: function(url) {
        if(device.platform === 'Android') {
            navigator.app.loadUrl(url, {openExternal:true});
        } else {
            window.open(url, '_blank', 'location=yes');
        }
    },
};

var getTimeMessage = function(date) {
  var mSecAgo = (new Date().getTime() - date.getTime());
  console.log("msec ago:" + mSecAgo);
  var timeSec = Math.floor(mSecAgo / 1000);
  var unit = "";
  var amt = 0;
  if (timeSec < SEC_IN_MINUTE) {
    unit = "s";
    amt = timeSec;
  } else if (timeSec < SEC_IN_HOUR) {
    unit = "m";
    amt = Math.floor(timeSec / SEC_IN_MINUTE);
  } else if (timeSec < SEC_IN_DAY) {
    unit = "h";
    amt = Math.floor(timeSec / SEC_IN_HOUR);
  } else {
    unit = "d";
    amt = Math.floor(timeSec / SEC_IN_DAY);
  }

  return amt + unit;
}
