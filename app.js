const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            isAuthenticated: false,
            isLoading: true,
            userInfo: null,
            authToken: null,
            autoRedirecting: false
        };
    },
    
    async mounted() {
        await this.checkAuthentication();
    },
    
    methods: {
        async checkAuthentication() {
            this.isLoading = true;
            
            try {
                const token = localStorage.getItem('auth_token');
                const userInfo = localStorage.getItem('user_info');
                
                console.log('Checking auth - Token exists:', !!token, 'UserInfo exists:', !!userInfo);
                
                // Check for inconsistent state and clean up
                if (!token && userInfo) {
                    console.log('INCONSISTENT STATE: UserInfo exists but no token - clearing userInfo');
                    localStorage.removeItem('user_info');
                }
                if (token && !userInfo) {
                    console.log('INCONSISTENT STATE: Token exists but no userInfo - clearing token');
                    localStorage.removeItem('auth_token');
                }
                
                if (!token || !userInfo) {
                    // No authentication data found - stay on index page
                    console.log('No complete auth data found, staying on index page');
                    this.isLoading = false;
                    return;
                }
                
                this.authToken = token;
                this.userInfo = JSON.parse(userInfo);
                
                // Verify token is still valid by making a request to the profile endpoint
                const response = await fetch('http://localhost:3000/auth/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const apiResponse = await response.json();
                    const profileData = apiResponse.user || apiResponse;
                    console.log('Profile data received:', profileData);
                    this.userInfo = profileData;
                    this.isAuthenticated = true;
                    
                    // Update stored user info in case it changed
                    localStorage.setItem('user_info', JSON.stringify(profileData));
                    
                    // Auto-redirect to unified dashboard
                    console.log('User authenticated with role:', profileData?.role || 'unknown');
                    this.autoRedirectToDashboard();
                } else if (response.status === 401 || response.status === 403) {
                    // Token is invalid or expired - clear auth data
                    this.clearAuthData();
                    this.redirectToLogin();
                } else {
                    // Server error - don't clear token, just redirect to login
                    console.warn('Server error during auth check:', response.status);
                    this.redirectToLogin();
                }
            } catch (error) {
                console.error('Network error during authentication check:', error);
                // Network error - don't clear auth data, just redirect to login
                this.redirectToLogin();
            } finally {
                this.isLoading = false;
            }
        },
        
        logout() {
            this.clearAuthData();
            this.redirectToLogin();
        },
        
        clearAuthData() {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_info');
            this.authToken = null;
            this.userInfo = null;
            this.isAuthenticated = false;
        },
        
        redirectToLogin() {
            window.location.href = 'login.html';
        },
        
        goToLogin() {
            window.location.href = 'login.html';
        },
        
        autoRedirectToDashboard() {
            // Auto-redirect after 2 seconds based on role
            if (this.userInfo && !this.autoRedirecting) {
                this.autoRedirecting = true;
                setTimeout(() => {
                    // Double-check that we're still authenticated before redirecting
                    if (this.isAuthenticated && this.userInfo) {
                        switch(this.userInfo.role) {
                            case 'ADMIN':
                                this.goToAdminDashboard();
                                break;
                            case 'COACH':
                                this.goToCoachDashboard();
                                break;
                            case 'ARCHER':
                                this.goToArcherDashboard();
                                break;
                            default:
                                this.goToArcherDashboard();
                        }
                    }
                }, 2000);
            }
        },

        goToAdminDashboard() {
            window.location.href = 'dashboard.html';
        },

        goToCoachDashboard() {
            window.location.href = 'dashboard.html';
        },

        goToArcherDashboard() {
            window.location.href = 'dashboard.html';
        },

        // Helper method for making authenticated API requests
        async makeAuthenticatedRequest(url, options = {}) {
            const defaultOptions = {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            };
            
            try {
                const response = await fetch(url, { ...options, ...defaultOptions });
                
                if (response.status === 401) {
                    // Token expired or invalid
                    this.logout();
                    return null;
                }
                
                return response;
            } catch (error) {
                console.error('API request failed:', error);
                throw error;
            }
        }
    }
});

app.mount('#app');
