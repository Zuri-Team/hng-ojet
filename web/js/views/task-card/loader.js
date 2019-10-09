define(['ojs/ojcomposite', './viewModel', 'text!./view.html', 'text!./component.json'],
    function(Composite, view, viewModel, metadata) {
        Composite.register('task-card', {
            view: view,
            viewModel: viewModel,
            metadata: metadata
        });
    }
);