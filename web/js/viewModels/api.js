<<<<<<< HEAD
let platform = typeof window !== 'undefined' ? window.location.host : '127.0.0.1';

settings = platform.match(/(127.0.0.1|localhost)/) ? 'http://localhost:3000' : 'http://api.start.ng';

// settings.app_url = platform.match(/(127.0.0.1|localhost)/) ? 'http://127.0.0.1:8000/' : 'https://actualurl.com';
define(function () {
    return settings
})
=======
let platform="undefined"!=typeof window?window.location.host:"127.0.0.1";settings=platform.match(/(127.0.0.1|localhost)/)?"http://localhost:3000":"http://api.start.ng",define(function(){return settings});
>>>>>>> 47c204b670044215f192ee69f48a3830b599a9a9
