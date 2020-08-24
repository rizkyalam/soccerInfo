var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BPwGitTL7erhP0JhE3xvSg83vZJrwxaPcGi04SZFEtdHk0cpe9jtesRryto7ZyepezvpxjTUHaV365j4pHSjRwo",
   "privateKey": "EWwHqZ8T88bebAC7W5jdM0biHxhWzzDAjO_s7fbw0Hs"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://sg2p.notify.windows.com/w/?token=BQYAAABfN9aya9c8cuP7Z1V6fNnolYmoOV6Q679LeIKaPVNIGVW0spM1om0zA1WS6Olb5UFqQeiwHIvugeUISd5GPlNcAqZw9ahovtoj2jaCMSRehhSHdA2YDxfAvVdQdMIoEfZZPLRKsBoLdV3%2b1PAHPtZ%2ffER4QZNchnMvfuLm8tUdJ9e1A4SPpyZ4Ko4lraTq8FuFqVBTMOZQVLLsJil16fQXhZ2yX6C3BevYiEydqnT06c821RF0OKIaHWoDawLlPSoXFsJO64g23G%2feT8cWbP7YLveNlZQ8J9P%2f1xfPJ7VkBxtIzvfcxTcE%2fcF5UPkOUOg%3d",
   "keys": {
       "p256dh": "BFXcO2xV7kskVVIZYpwgQEvn5ohftduxh9FfzYdGF64CeF4h+0MoQTM+ubCIxdKcucH0m4TBx34SWs+Xy5QXb7s=",
       "auth": "gWaeMpxpDJ9s2KBKZdxWlw=="
   }
};
var payload = 'Jangan lupa untuk melihat pertandingan favorit anda!';
 
var options = {
   gcmAPIKey: '618656309010',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);