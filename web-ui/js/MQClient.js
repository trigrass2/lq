(function ($, window, undefined) {

    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function () {

            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                
                    continue;
                }

                if (shouldSubscribe) {
                  
                    subscriptionMethod = hub.on;
                } else {
                  
                    subscriptionMethod = hub.off;
                }

               
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                    
                            continue;
                        }

                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {

            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function () {

            registerHubProxies(proxies, false);
        });

        proxies['mQHub'] = this.createHubProxy('mQHub'); 
        proxies['mQHub'].client = { };
        proxies['mQHub'].server = {
            joinBusiness: function (businessID) {

                return proxies['mQHub'].invoke.apply(proxies['mQHub'], $.merge(["JoinBusiness"], $.makeArray(arguments)));
             },

            leaveBusiness: function (businessID) {

                return proxies['mQHub'].invoke.apply(proxies['mQHub'], $.merge(["LeaveBusiness"], $.makeArray(arguments)));
             },

            register: function (businessID) {

                return proxies['mQHub'].invoke.apply(proxies['mQHub'], $.merge(["Register"], $.makeArray(arguments)));
             },

            unRegister: function (businessID) {

                return proxies['mQHub'].invoke.apply(proxies['mQHub'], $.merge(["UnRegister"], $.makeArray(arguments)));
             }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());


    var groupHub = $.connection.mQHub;
    var _sHandle;
    window.MES =
           {
               MQHub: {
                   SubscribeNotification: function (handle) { if (handle) _sHandle = handle },
                   JoinBusiness: groupHub.server.joinBusiness,
                   LeaveBusiness: groupHub.server.leaveBusiness,
                   Register: groupHub.server.register,
                   UnRegister: groupHub.server.unRegister
               }
           };


    groupHub.client.subscribeNotification = function (group, message) {


        if (_sHandle) _sHandle(group, message);
    };

    $.connection.hub.start();
}(window.jQuery, window));