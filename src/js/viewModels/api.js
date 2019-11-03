// let platform =
//     typeof window !== "undefined" ? window.location.host : "127.0.0.1";

// settings = platform.match(/(127.0.0.1|localhost)/)
//   ? "http://localhost:3000"
//   : "https://api.start.ng";

  var settings = "https://api.start.ng";
//settings = "http://localhost:8000";

// settings.app_url = platform.match(/(127.0.0.1|localhost)/) ? 'http://127.0.0.1:8000/' : 'https://actualurl.com';
define(function() {
    return settings;
});
