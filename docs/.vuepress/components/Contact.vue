<template>
    <div class="home-contact">
        <div class="header">
            <span id="contact-header">CONTACT</span>
        </div>
        <div class="content">
            <!-- TODO: Move this component to the below position of the avatar in the `Welcome` component -->
            <!-- https://icon-sets.iconify.design/logos/ -->
            <a href="https://facebook.com/msc.thanhvu" target="_blank"><img id="icon-facebook" src="/icon/contact/logos--facebook.svg" alt="Facebook" draggable="false"></a>
            <a href="https://github.com/ntvu19" target="_blank"><img id="icon-github" src="/icon/contact/logos--github-icon.svg" alt="GitHub" draggable="false"></a>
            <a href="mailto:msc.thanhvu@gmail.com" target="_blank"><img id="icon-gmail" src="/icon/contact/logos--google-gmail.svg" alt="Gmail" draggable="false"></a>
            <a href="https://linkedin.com/in/nguyenthanhvu" target="_blank"><img id="icon-linked" src="/icon/contact/logos--linkedin-icon.svg" alt="LinkedIn" draggable="false"></a>
            <a href="https://t.me/ntvu19" target="_blank"><img id="icon-telegram" src="/icon/contact/logos--telegram.svg" alt="Telegram" draggable="false"></a>
        </div>
    </div>
    
</template>

<script>
export default {
    name: 'Contact',
    data() {
        return {
            //
        }
    },
    methods: {

    },
    mounted() {
        //
    }
}
</script>

<style scoped>
    @import '../styles/contact.scss';
</style>