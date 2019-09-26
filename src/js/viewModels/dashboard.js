define([
        'ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojoffcanvas', 'ojs/ojbutton', 'ojs/ojmodule', 'ojs/ojcomposite', 'ojs/ojavatar', 'ojs/ojlabel', 'ojs/ojprogress', 'ojs/ojcollapsible'
    ],
    function(oj, ko) {

        function DashboardViewModel() {
            var self = this;
            this.drawer = {
                "displayMode": "overlay",
                "selector": "#drawer",
                "content": "#main"
            };

            this.toggleDrawer = function() {
                return oj.OffcanvasUtils.toggle(self.drawer);
            };
        }


        /*
         * Returns a constructor for the ViewModel so that the ViewModel is constructed
         * each time the view is displayed.  Return an instance of the ViewModel if
         * only one instance of the ViewModel is needed.
         */
        return new DashboardViewModel();
    });