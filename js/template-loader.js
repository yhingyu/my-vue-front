// Template Loader Utility
class TemplateLoader {
    constructor() {
        this.cache = new Map();
    }

    async loadTemplate(path) {
        if (this.cache.has(path)) {
            return this.cache.get(path);
        }

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load template: ${path}`);
            }
            const content = await response.text();
            this.cache.set(path, content);
            return content;
        } catch (error) {
            console.error(`Error loading template ${path}:`, error);
            return '';
        }
    }

    async loadMultipleTemplates(paths) {
        const promises = paths.map(path => this.loadTemplate(path));
        return Promise.all(promises);
    }

    clearCache() {
        this.cache.clear();
    }
}

// Global template loader instance
window.templateLoader = new TemplateLoader();

// Template loader mixin for Vue components
window.templateLoaderMixin = {
    data() {
        return {
            templates: {},
            templatesLoaded: false,
            templateLoadingError: null
        };
    },
    
    async mounted() {
        await this.loadTemplates();
    },
    
    methods: {
        async loadTemplates() {
            try {
                const templatePaths = this.getTemplatePaths();
                const templateContents = await window.templateLoader.loadMultipleTemplates(templatePaths);
                
                templatePaths.forEach((path, index) => {
                    const templateName = this.getTemplateNameFromPath(path);
                    this.templates[templateName] = templateContents[index];
                });
                
                this.templatesLoaded = true;
                this.$forceUpdate(); // Force re-render with loaded templates
            } catch (error) {
                console.error('Error loading templates:', error);
                this.templateLoadingError = error.message;
            }
        },
        
        getTemplatePaths() {
            // Override this method in your component
            return [];
        },
        
        getTemplateNameFromPath(path) {
            // Extract template name from path (e.g., 'templates/shared/header.html' -> 'header')
            const pathParts = path.split('/');
            const filename = pathParts[pathParts.length - 1];
            return filename.split('.')[0];
        },
        
        hasTemplate(templateName) {
            return this.templatesLoaded && this.templates[templateName];
        }
    }
};