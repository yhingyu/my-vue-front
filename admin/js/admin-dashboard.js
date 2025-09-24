const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoading: true,
            isAuthenticated: false,
            userInfo: null,
            totalUsers: 0,
            totalCoaches: 0,
            totalArchers: 0,
            systemHealth: '100%',
            recentUsers: [],
            systemLogs: []
        }
    },
    
    async mounted() {
        await this.checkAuth();
        if (this.isAuthenticated) {
            await this.loadDashboardData();
        }
    },
    
    methods: {
        async checkAuth() {
            try {
                const token = localStorage.getItem('auth_token');
                const userInfo = localStorage.getItem('user_info');
                
                console.log('Admin dashboard - checking auth, token exists:', !!token, 'UserInfo exists:', !!userInfo);
                
                // Check for inconsistent state
                if (!token && userInfo) {
                    console.log('INCONSISTENT STATE: UserInfo exists but no token - clearing userInfo');
                    localStorage.removeItem('user_info');
                }
                
                if (!token) {
                    console.log('No token found, redirecting to login');
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
                    console.log('Admin dashboard - user info received:', this.userInfo);
                    if (this.userInfo.role !== 'ADMIN') {
                        // Wrong role - remove token and redirect
                        console.log('User role is not ADMIN:', this.userInfo.role);
                        localStorage.removeItem('auth_token');
                        this.redirectToLogin();
                        return;
                    }
                    console.log('Authentication successful, setting isAuthenticated = true');
                    this.isAuthenticated = true;
                } else if (response.status === 401 || response.status === 403) {
                    // Authentication failed - remove invalid token
                    localStorage.removeItem('auth_token');
                    this.redirectToLogin();
                } else {
                    // Network or server error - don't remove token, just redirect
                    console.warn('Server error during auth check:', response.status);
                    this.redirectToLogin();
                }
            } catch (error) {
                console.error('Network error during auth check:', error);
                // Network error - don't remove token, just redirect
                this.redirectToLogin();
            } finally {
                this.isLoading = false;
            }
        },

        async loadDashboardData() {
            try {
                // Mock data for now - replace with actual API calls
                this.totalUsers = 45;
                this.totalCoaches = 8;
                this.totalArchers = 37;
                
                this.recentUsers = [
                    { id: 1, email: 'coach1@example.com', role: 'coach', isActive: true },
                    { id: 2, email: 'archer1@example.com', role: 'archer', isActive: true },
                    { id: 3, email: 'archer2@example.com', role: 'archer', isActive: false },
                    { id: 4, email: 'coach2@example.com', role: 'coach', isActive: true }
                ];

                this.systemLogs = [
                    { id: 1, timestamp: new Date(), message: 'User login: coach1@example.com', level: 'info' },
                    { id: 2, timestamp: new Date(Date.now() - 300000), message: 'Profile updated: archer1@example.com', level: 'info' },
                    { id: 3, timestamp: new Date(Date.now() - 600000), message: 'Failed login attempt', level: 'warning' },
                    { id: 4, timestamp: new Date(Date.now() - 900000), message: 'System backup completed', level: 'success' }
                ];
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            }
        },

        logout() {
            localStorage.removeItem('auth_token');
            window.location.href = '../login.html';
        },

        redirectToLogin() {
            // Add a small delay to prevent infinite loops
            setTimeout(() => {
                window.location.replace('../login.html');
            }, 100);
        },

        editUser(user) {
            alert(`Edit user: ${user.email}`);
        },

        toggleUserStatus(user) {
            user.isActive = !user.isActive;
            alert(`User ${user.email} ${user.isActive ? 'activated' : 'deactivated'}`);
        },

        formatDate(date) {
            return new Date(date).toLocaleString();
        }
    }
}).mount('#app');
