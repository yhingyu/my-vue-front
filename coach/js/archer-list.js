const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoading: true,
            isAuthenticated: false,
            userInfo: null,
            members: [],
            membersLoading: false,
            searchTerm: ''
        }
    },
    
    computed: {
        filteredMembers() {
            if (!this.searchTerm) return this.members;
            
            const term = this.searchTerm.toLowerCase();
            return this.members.filter(member => 
                (member.firstName && member.firstName.toLowerCase().includes(term)) ||
                (member.lastName && member.lastName.toLowerCase().includes(term)) ||
                (member.user?.email && member.user.email.toLowerCase().includes(term)) ||
                (member.schoolName && member.schoolName.toLowerCase().includes(term))
            );
        }
    },
    
    async mounted() {
        await this.checkAuth();
        if (this.isAuthenticated) {
            await this.loadMembers();
        }
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
                    if (this.userInfo.role !== 'COACH') {
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

        async loadMembers() {
            this.membersLoading = true;
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch('http://localhost:3000/profiles', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const profiles = await response.json();
                    // Filter only archer profiles
                    this.members = profiles.filter(profile => 
                        profile.user && profile.user.role === 'ARCHER'
                    ).map(member => ({
                        ...member,
                        sessionCount: Math.floor(Math.random() * 20) + 1,
                        progressScore: (Math.random() * 10).toFixed(1)
                    }));
                } else {
                    throw new Error('Failed to load profiles');
                }
            } catch (error) {
                console.error('Failed to load members:', error);
                // Fallback to mock data
                this.members = [
                    {
                        id: 1,
                        firstName: 'John',
                        lastName: 'Doe',
                        user: { email: 'john@example.com' },
                        schoolName: 'Archery Academy',
                        dateJoined: new Date('2024-01-15'),
                        sessionCount: 12,
                        progressScore: '8.5'
                    },
                    {
                        id: 2,
                        firstName: 'Sarah',
                        lastName: 'Smith',
                        user: { email: 'sarah@example.com' },
                        schoolName: 'Target Sports School',
                        dateJoined: new Date('2024-02-20'),
                        sessionCount: 8,
                        progressScore: '7.2'
                    }
                ];
            } finally {
                this.membersLoading = false;
            }
        },

        async refreshMembers() {
            await this.loadMembers();
        },

        viewMemberProfile(member) {
            alert(`View profile for ${member.firstName} ${member.lastName}`);
        },

        trackProgress(member) {
            alert(`Track progress for ${member.firstName} ${member.lastName}`);
        },

        scheduleSession(member) {
            alert(`Schedule session for ${member.firstName} ${member.lastName}`);
        },

        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },

        logout() {
            localStorage.removeItem('auth_token');
            window.location.href = '../index.html';
        },

        redirectToLogin() {
            window.location.href = '../index.html';
        }
    }
}).mount('#app');
