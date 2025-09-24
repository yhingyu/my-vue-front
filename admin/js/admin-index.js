const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoading: true,
            isAuthenticated: false,
            userInfo: null,
            currentPage: 'home'
        }
    },
    
    async mounted() {
        await this.checkAuth();
    },
    
    methods: {
        async checkAuth() {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    this.redirectToLogin();
                    return;
                }

                const response = await fetch('http://localhost:3000/auth/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    this.userInfo = await response.json();
                    if (this.userInfo.role !== 'ADMIN') {
                        this.redirectToLogin();
                        return;
                    }
                    this.isAuthenticated = true;
                } else {
                    this.redirectToLogin();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                this.redirectToLogin();
            } finally {
                this.isLoading = false;
            }
        },

        logout() {
            localStorage.removeItem('auth_token');
            window.location.href = '../index.html';
        },

        redirectToLogin() {
            window.location.href = '../index.html';
        },

        goToUserManagement() {
            // This would navigate to a user management page
            alert('User Management feature coming soon!');
        },

        goToSystemSettings() {
            // This would navigate to system settings page
            alert('System Settings feature coming soon!');
        }
    }
}).mount('#app');
