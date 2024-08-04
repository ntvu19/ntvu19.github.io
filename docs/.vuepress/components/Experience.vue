<!-- Work experience -->
<template>
    <div class="home-experience">
        <div class="header">
            <span id="experience-header">WORK EXPERIENCE</span>
        </div>
        
        <div class="content">
            <div class="opswat">
                <div class="logo-container">
                    <img v-bind:src="opswatLogoUrl" alt="OPSWAT Logo" class="logo">
                </div>
                <!-- TODO: Use table format instead -->
                <ul class="work-description">
                    <li>Product: (Name of product)</li>
                    <li>Team Structure: (Team structure)</li>
                    <li>Description: (This is description)</li>
                    <li>Technical Stack: (Technical stack includes: ...)</li>
                    <li>Resolved Problems: (Problems resolved includes: ...)</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Experience',
    data() {
        return {
            opswatLogoUrl: '/opswat-light.svg'
        }
    },
    methods: {
        isDarkMode() {
            return document.documentElement.classList.contains('dark');
        }
    },
    mounted() {
        const btnDarkMode = document.querySelector('.toggle-color-mode-button');
        const btnVpDarkMode = document.querySelector('.vp-toggle-color-mode-button');

        // Change OPSWAT logo on start
        setTimeout(() => {
            this.opswatLogoUrl = this.isDarkMode() === true ? '/opswat-dark.svg' : '/opswat-light.svg';
        }, 0);
        
        // Change OPSWAT logo dark/light mode (on local)
        btnDarkMode?.addEventListener('click', () => {
            this.opswatLogoUrl = this.isDarkMode() === true ? '/opswat-dark.svg' : '/opswat-light.svg';
        })

        // Change OPWAT logo dark/light mode (on cloud)
        btnVpDarkMode?.addEventListener('click', () => {
            this.opswatLogoUrl = this.isDarkMode() === true ? '/opswat-dark.svg' : '/opswat-light.svg';
        })
    }
}
</script>

<style scoped>
    @import '../styles/experience.scss';
</style>