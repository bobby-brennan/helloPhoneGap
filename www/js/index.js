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
var showTopics = function() {
    console.log("showing topics");
    var topics = JSON.parse(localStorage.topics);
    console.log("found " + topics.length + " topics");
    console.log("topics:" + JSON.stringify(topics));
    for (var i = 0; i < topics.length; ++i) {
        console.log("i:" + i);
        //console.log("topic:" + topics[i].topic);
        var functionCall = "showTopic('" + topics[i].topic + "\')";
        console.log("function call:" + functionCall);
        var topicHtml = '<div class="topic" onclick="' + functionCall + '">';
        topicHtml +=  '<div class="topicText">';
        topicHtml += topics[i].topic;
        topicHtml += '</div><div class="unreadCount">';
        topicHtml += topics[i].unread;
        topicHtml += '</div></div>';
        console.log("inserting:" + topicHtml);
        $('#topicList').append(topicHtml);
    }
}
 
var app = {
    // Application Constructor
    initialize: function() {
        console.log("init");
        this.bindEvents();
        $.support.cors;
        $.mobile.allowCrossDomainPages;
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
        $(function() {
            showTopics();
        });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');
    },
    
    addTopic: function(term) {
        term = term.replace(/[\W\-]/g, '');
        var curTopics = JSON.parse(localStorage.topics);
        curTopics.push({topic: term, unread: 0});
        localStorage.topics = JSON.stringify(curTopics);
    }
};
