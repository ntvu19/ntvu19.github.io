<template>
  <div class="home-welcome">
    <div class="header">
      <span id="welcome-header">ABOUT ME</span>
    </div>

    <div class="content">
      <div class="summary">
        <p>
          My name is Thanh-Vu Nguyen, I have completed my bachelor's degree at
          University of Science (Ho Chi Minh City, Vietnam). During my academic
          journey, I earned the respect of my professors due to my diligent and
          dedicated approach to learning.
        </p>
        <p>
          I have a strong passion for acquiring new knowledge, particularly in
          the field of back-end software development. However, I am not limited
          to one area of expertise and find great fascination in exploring
          various domains such as DevOps, Software Architecture, and Artificial
          Intelligence, with a particular focus on Computer Vision.
        </p>
        <p>
          I enjoy pushing myself by tackling challenging software development
          and system architecture problems. I have gained some practical
          experience in web application development through university projects.
        </p>
        <p>
          My primary areas of interest include building highly practical
          software, honing problem solving skills, writing maintainable and
          scalable code, optimizing systems through source code and databases,
          ensuring user data security, and more.
        </p>
        <p>
          During my free time, I like brainstorming ideas for software
          applications that cater to essential user needs and continually
          expanding my knowledge in these areas.
        </p>
      </div>
      <div class="master-container">
        <div class="avatar-wrapper">
          <img class="avatar" src="/avatar.jfif" alt="Avatar" />
        </div>
        <div class="contact">
          <!-- https://icon-sets.iconify.design/logos/ -->
          <a href="https://facebook.com/msc.thanhvu" target="_blank">
            <img id="icon-facebook" src="/icon/contact/logos--facebook.svg" alt="Facebook" draggable="false" />
          </a>
          <a href="https://github.com/ntvu19" target="_blank">
            <img id="icon-github" src="/icon/contact/logos--github-icon.svg" alt="GitHub" draggable="false" />
          </a>
          <a href="mailto:msc.thanhvu@gmail.com" target="_blank">
            <img id="icon-gmail" src="/icon/contact/logos--google-gmail.svg" alt="Gmail" draggable="false" />
          </a>
          <a href="https://linkedin.com/in/nguyenthanhvu" target="_blank">
            <img id="icon-linked" src="/icon/contact/logos--linkedin-icon.svg" alt="LinkedIn" draggable="false" />
          </a>
          <a href="https://t.me/ntvu19" target="_blank">
            <img id="icon-telegram" src="/icon/contact/logos--telegram.svg" alt="Telegram" draggable="false" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Welcome",
};
</script>

<style scoped>
@import "../styles/welcome.scss";
</style>
