const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoading: true,
            isAuthenticated: false,
            userInfo: null,
            totalMembers: 0,
            activeMembers: 0,
            upcomingSessions: 0,
            avgProgress: '8.5',
            recentActivities: [],
            archersCount: 0,
            sessionsCount: 0
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
                
                console.log('Coach dashboard auth check - Token exists:', !!token, 'UserInfo exists:', !!userInfo);
                
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
                    if (this.userInfo.role !== 'COACH') {
                        // Wrong role - remove token and redirect
                        localStorage.removeItem('auth_token');
                        this.redirectToLogin();
                        return;
                    }
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
                // Load actual archer count from API
                const token = localStorage.getItem('auth_token');
                const response = await fetch('http://localhost:3000/profiles', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const profiles = await response.json();
                    this.totalMembers = profiles.length;
                    this.activeMembers = profiles.filter(p => p.user?.isActive).length;
                } else {
                    // Fallback to mock data
                    this.totalMembers = 15;
                    this.activeMembers = 12;
                }

                // Mock data for other stats
                this.upcomingSessions = 8;
                this.archersCount = this.totalMembers;
                this.sessionsCount = 45;
                
                this.recentActivities = [
                    { id: 1, title: 'New archer registered: John Doe', time: '2 hours ago' },
                    { id: 2, title: 'Training session completed', time: '4 hours ago' },
                    { id: 3, title: 'Progress updated for Sarah Smith', time: '1 day ago' },
                    { id: 4, title: 'Schedule updated for next week', time: '2 days ago' }
                ];
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
                // Use mock data as fallback
                this.totalMembers = 15;
                this.activeMembers = 12;
                this.upcomingSessions = 8;
                this.recentActivities = [
                    { id: 1, title: 'New archer registered', time: '2 hours ago' },
                    { id: 2, title: 'Training session completed', time: '4 hours ago' }
                ];
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

        scheduleSession() {
            alert('Schedule session feature coming soon!');
        },

        recordProgress() {
            alert('Record progress feature coming soon!');
        }
    }
}).mount('#app');
