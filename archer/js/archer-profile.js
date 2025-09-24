const { createApp } = Vue;

createApp({
    data() {
        return {
            isLoading: true,
            isAuthenticated: false,
            userInfo: null,
            profile: null,
            profileLoading: false,
            editMode: false,
            profileEdit: {
                firstName: '',
                lastName: '',
                dob: '',
                phone: '',
                city: '',
                schoolName: '',
                emergencyContact: '',
                contactPhone: '',
                contactRelation: '',
                experienceLevel: '',
                bowType: '',
                goals: ''
            }
        }
    },
    
    async mounted() {
        await this.checkAuth();
        if (this.isAuthenticated) {
            await this.loadProfile();
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
                    if (this.userInfo.role !== 'ARCHER') {
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

        async loadProfile() {
            this.profileLoading = true;
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch('http://localhost:3000/profiles/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    this.profile = await response.json();
                    this.initializeEditForm();
                } else {
                    // If no profile exists, create a default one
                    this.profile = {
                        firstName: '',
                        lastName: '',
                        dob: '',
                        phone: '',
                        city: '',
                        schoolName: '',
                        emergencyContact: '',
                        contactPhone: '',
                        contactRelation: '',
                        experienceLevel: '',
                        bowType: '',
                        goals: ''
                    };
                    this.initializeEditForm();
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
                this.profile = {
                    firstName: '',
                    lastName: '',
                    dob: '',
                    phone: '',
                    city: '',
                    schoolName: '',
                    emergencyContact: '',
                    contactPhone: '',
                    contactRelation: '',
                    experienceLevel: '',
                    bowType: '',
                    goals: ''
                };
                this.initializeEditForm();
            } finally {
                this.profileLoading = false;
            }
        },

        initializeEditForm() {
            this.profileEdit = {
                firstName: this.profile.firstName || '',
                lastName: this.profile.lastName || '',
                dob: this.profile.dob || '',
                phone: this.profile.phone || '',
                city: this.profile.city || '',
                schoolName: this.profile.schoolName || '',
                emergencyContact: this.profile.emergencyContact || '',
                contactPhone: this.profile.contactPhone || '',
                contactRelation: this.profile.contactRelation || '',
                experienceLevel: this.profile.experienceLevel || '',
                bowType: this.profile.bowType || '',
                goals: this.profile.goals || ''
            };
        },

        async saveProfile() {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await fetch('http://localhost:3000/profiles', {
                    method: this.profile.id ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(this.profileEdit)
                });

                if (response.ok) {
                    this.profile = await response.json();
                    this.editMode = false;
                    alert('Profile saved successfully!');
                } else {
                    throw new Error('Failed to save profile');
                }
            } catch (error) {
                console.error('Failed to save profile:', error);
                alert('Failed to save profile. Please try again.');
            }
        },

        cancelEdit() {
            this.editMode = false;
            this.initializeEditForm();
        },

        formatDate(date) {
            if (!date) return '';
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
