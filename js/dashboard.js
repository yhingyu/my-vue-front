const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoading: true,
            isAuthenticated: false,
            userInfo: null,
            profile: null,
            activeTab: 'overview',
            dashboardData: {
                // Admin data
                totalUsers: 0,
                totalCoaches: 0,
                totalArchers: 0,
                systemHealth: '100%',
                
                // Coach data
                myArchers: 12,
                weekSessions: 8,
                upcomingEvents: 3,
                
                // Archer data
                currentScore: 8.5,
                practiceHours: 45,
                totalSessions: 23,
                averageScore: 7.8,
                memberSince: '2024'
            }
        }
    },
    
    computed: {
        availableTabs() {
            const tabs = [
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'profile', label: 'Profile', icon: '👤' }
            ];
            
            // Add role-specific tabs
            if (this.isAdmin()) {
                tabs.splice(1, 0, { id: 'users', label: 'Users', icon: '👥' });
            }
            
            if (this.isCoach() || this.isArcher()) {
                tabs.splice(-1, 0, { id: 'sessions', label: 'Sessions', icon: '📅' });
            }
            
            return tabs;
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
                const userInfo = localStorage.getItem('user_info');
                
                console.log('Unified dashboard auth check - Token exists:', !!token, 'UserInfo exists:', !!userInfo);
                
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

                console.log('Making profile request...');
                const response = await fetch('http://localhost:3000/auth/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log('Profile response status:', response.status);

                if (response.ok) {
                    const apiResponse = await response.json();
                    console.log('Full API response:', apiResponse);
                    
                    // Extract user data from the nested response
                    this.userInfo = apiResponse.user || apiResponse;
                    console.log('Extracted user info:', this.userInfo);
                    console.log('Authentication successful for role:', this.userInfo?.role || 'unknown');
                    this.isAuthenticated = true;
                } else if (response.status === 401 || response.status === 403) {
                    console.log('Authentication failed with status:', response.status);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_info');
                    this.redirectToLogin();
                } else {
                    console.warn('Server error during auth check:', response.status);
                    this.redirectToLogin();
                }
            } catch (error) {
                console.error('Network error during auth check:', error);
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
                    console.log('Profile loaded:', this.profile);
                } else {
                    console.log('Profile not found, using defaults');
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
                console.log('Loading dashboard data for role:', this.userInfo?.role || 'unknown');
                
                if (this.isAdmin()) {
                    await this.loadAdminData();
                } else if (this.isCoach()) {
                    await this.loadCoachData();
                } else if (this.isArcher()) {
                    await this.loadArcherData();
                }
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            }
        },

        async loadAdminData() {
            // Mock data for now - replace with actual API calls
            this.dashboardData.totalUsers = 25;
            this.dashboardData.totalCoaches = 5;
            this.dashboardData.totalArchers = 18;
            console.log('Admin data loaded');
        },

        async loadCoachData() {
            // Mock data for now - replace with actual API calls
            this.dashboardData.myArchers = 12;
            this.dashboardData.weekSessions = 8;
            this.dashboardData.upcomingEvents = 3;
            console.log('Coach data loaded');
        },

        async loadArcherData() {
            // Mock data for now - replace with actual API calls
            this.dashboardData.memberSince = this.profile?.dateJoined ? 
                new Date(this.profile.dateJoined).getFullYear().toString() : '2024';
            console.log('Archer data loaded');
        },

        // Role checking methods
        isAdmin() {
            return this.userInfo && this.userInfo.role === 'ADMIN';
        },

        isCoach() {
            return this.userInfo && this.userInfo.role === 'COACH';
        },

        isArcher() {
            return this.userInfo && this.userInfo.role === 'ARCHER';
        },

        // UI helper methods
        getRoleIcon(role) {
            if (!role) return '👤';
            const icons = {
                'ADMIN': '👑',
                'COACH': '🎯',
                'ARCHER': '🏹'
            };
            return icons[role] || '👤';
        },

        getUserDisplayName() {
            if (this.profile && this.profile.firstName) {
                return `${this.profile.firstName} ${this.profile.lastName || ''}`.trim();
            }
            return this.userInfo?.email?.split('@')[0] || 'User';
        },

        getInitials() {
            const name = this.getUserDisplayName();
            return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        },

        formatDate(dateString) {
            if (!dateString) return 'Unknown';
            return new Date(dateString).toLocaleDateString();
        },

        getDateString(offset) {
            const date = new Date();
            date.setDate(date.getDate() - offset);
            return date.toLocaleDateString();
        },

        // Action methods
        manageUsers() {
            this.activeTab = 'users';
        },

        viewSystemLogs() {
            alert('System reports feature coming soon!');
        },

        scheduleSession() {
            alert('Schedule session feature coming soon!');
        },

        viewProgress() {
            alert('Progress tracking feature coming soon!');
        },

        recordPractice() {
            alert('Record practice feature coming soon!');
        },

        viewSchedule() {
            this.activeTab = 'sessions';
        },

        editProfile() {
            alert('Edit profile feature coming soon!');
        },

        changePassword() {
            alert('Change password feature coming soon!');
        },

        logout() {
            console.log('Logging out...');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_info');
            window.location.href = 'login.html';
        },

        redirectToLogin() {
            setTimeout(() => {
                window.location.replace('login.html');
            }, 100);
        }
    }
}).mount('#app');