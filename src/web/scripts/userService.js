/*global traceService:false */
/*global PureCloud:false */
/*exported userService */
/*exported startup */
/* jshint -W097 */

'use strict';

var userService = (function(){
    var CDN_URL = '/';// (typeof CDN_URL === 'undefined') ? '/' : CDN_URL;
    var OUTLOOK_FOR_MAC_USER_AGENT = /^Mozilla\/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit\/\d\d\d.\d+.\d+ (KHTML, like Gecko)$/

    function createUser(email, name, pictureUrl, largepictureUrl, phone, department, title, status, id) {
        return {
            name: name,
            email: email,
            picture: pictureUrl,
            largePicture: largepictureUrl,
            phone: phone,
            department: department,
            title: title,
            status: status ? status.replace(/ /g,'') : "",
            id: id

        };
    }

    return {
        getUser: function (email, callback) {
            traceService.debug("get user " + JSON.stringify(email));

            if(callback !== null){
                PureCloud.users.getUsers(null,null, null, null, null, null, email.emailAddress).done(function (data) {

                    if(data.entities.length === 1){

                        var user = data.entities[0];
                        var name = user.name;
                        var image = CDN_URL + "images/unknownuser48.png";
                        var largeImage = CDN_URL + "images/unknownuser96.png";

                        if(user.userImages !== null && user.userImages.length >= 2)// && !navigator.userAgent.match(OUTLOOK_FOR_MAC_USER_AGENT )){
                            image = user.userImages[0].imageUri;
                            largeImage = user.userImages[1].imageUri;
                        }

                        var phone = user.phoneNumber;
                        var department = user.department;
                        var status= user.status.name;
                        var title = user.title;
                        var id = user.id;
                        callback(createUser( email.emailAddress, name, image, largeImage, phone, department, title, status, id));
                    }else{
                        callback(createUser(email.emailAddress, email.displayName));
                    }
                }).error(function(){
                    callback(createUser(email.emailAddress, email.displayName));
                });
            }
        }
    };
});
