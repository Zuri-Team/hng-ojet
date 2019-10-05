define(['ojs/ojknockout', 'ojs/ojbutton'],
    function() {
        function taskModel(context) {
            var self = this;

            //At the start of your viewModel constructor
            var busyContext = oj.Context.getContext(context.element).getBusyContext();
            var options = { "description": "Loading task..." };
            self.busyResolve = busyContext.addBusyState(options);

            self.composite = context.element;

            //Example observable
            self.properties = context.properties;
            // Example for parsing context properties
            // if (context.properties.name) {
            //     parse the context properties here
            // }

            //Once all startup and async activities have finished, relocate if there are any async activities
            self.busyResolve();
        }
        return taskModel;
    }
);