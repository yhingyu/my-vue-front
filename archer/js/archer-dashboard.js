const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoading: true,
            isAuthenticated: false,
            userInfo: null,
            profile: null,
            memberSince: '2024',
            practiceHours: 45,
            currentScore: 8.5,
            upcomingSessions: 3,
            skillLevel: 'Intermediate',
            totalSessions: 23,
            averageScore: 7.8,
            recentAchievements: []
        }
    },
    
    async mounted() {
        await this.checkAuth();
        if (this.isAuthenticated) {
            await this.loadProfile();
            await this.loadDashboardData();
        }
    },
    
    methods: {
        async checkAuth() {
            try {
                const token = localStorage.getItem('auth_token');
                console.log('Dashboard auth check - Token exists:', !!token);
                
                if (!token) {
                    console.log('No token found, redirecting to login');
                    this.redirectToLogin();
                    return;
                }

                console.log('Making profile request...');
                const response = await fetch('http://localhost:3000/auth/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log('Profile response status:', response.status);

                if (response.ok) {
                    this.userInfo = await response.json();
                    console.log('User info received:', this.userInfo);
                    
                    if (this.userInfo.role !== 'ARCHER') {
                        console.log('Wrong role for archer dashboard:', this.userInfo.role);
                        // Wrong role - remove token and redirect
                        localStorage.removeItem('auth_token');
                        this.redirectToLogin();
                        return;
                    }
                    console.log('Authentication successful');
                    this.isAuthenticated = true;
                } else if (response.status === 401 || response.status === 403) {
                    console.log('Authentication failed with status:', response.status);
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

        async loadProfile() {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch('http://localhost:3000/profiles/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    this.profile = await response.json();
                } else {
                    this.profile = {
                        firstName: '',
                        lastName: '',
                        dateJoined: new Date()
                    };
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
                this.profile = {
                    firstName: '',
                    lastName: '',
                    dateJoined: new Date()
                };
            }
        },

        async loadDashboardData() {
            try {
                // Mock data for now - replace with actual API calls
                this.memberSince = this.profile?.dateJoined ? 
                    new Date(this.profile.dateJoined).getFullYear().toString() : '2024';
                
                this.recentAchievements = [
                    { id: 1, title: 'First Bullseye!', date: '2 days ago' },
                    { id: 2, title: 'Completed 20 Sessions', date: '1 week ago' },
                    { id: 3, title: 'Improved Average Score', date: '2 weeks ago' }
                ];
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            }
        },

        viewProgress() {
            alert('Progress tracking feature coming soon!');
        },

        viewSchedule() {
            alert('Schedule view feature coming soon!');
        },

        recordPractice() {
            alert('Record practice feature coming soon!');
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
        }
    }
}).mount('#app');
