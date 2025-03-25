<template>
  <div class="home-welcome">
    <div class="header">
      <span id="welcome-header">🖼️ Vu T. Nguyen 🎨</span>
    </div>

    <div class="content">
      <div class="summary">
        <h3>Welcome!</h3>
        <div class="intro-text">
          <p>I'm a software engineer with a passion for:</p>
          <div class="highlight-points">
            <span>🔹 Building scalable systems</span>
            <span>🔹 Optimizing databases</span>
            <span>🔹 Designing robust architectures</span>
          </div>
          <p>
            I dive deep into the essence of technology to refine solutions and
            push innovation forward.
          </p>
        </div>
        <ul class="skills-list">
          <li>
            <span class="icon">🚀</span>
            <div class="skill-content">
              <span class="skill-title">Software Engineer</span>
              <span class="skill-desc"
                >Crafting scalable and efficient solutions</span
              >
            </div>
          </li>
          <li>
            <span class="icon">💾</span>
            <div class="skill-content">
              <span class="skill-title">Database Optimization</span>
              <span class="skill-desc"
                >Maximizing performance and reliability</span
              >
            </div>
          </li>
          <li>
            <span class="icon">🏗</span>
            <div class="skill-content">
              <span class="skill-title">System Architecture</span>
              <span class="skill-desc"
                >Designing robust and adaptable systems</span
              >
            </div>
          </li>
          <li>
            <span class="icon">🔍</span>
            <div class="skill-content">
              <span class="skill-title">Technology Researcher</span>
              <span class="skill-desc"
                >Exploring the essence of technology</span
              >
            </div>
          </li>
        </ul>
      </div>
      <div class="master-container">
        <div class="avatar-wrapper">
          <img class="avatar" src="/avatar.jfif" alt="Avatar" />
        </div>
        <div class="contact">
          <!-- https://icon-sets.iconify.design/logos/ -->
          <a href="https://facebook.com/msc.thanhvu" target="_blank">
            <img
              id="icon-facebook"
              src="/icon/contact/logos--facebook.svg"
              alt="Facebook"
              draggable="false"
            />
          </a>
          <a href="https://github.com/ntvu19" target="_blank">
            <img
              id="icon-github"
              src="/icon/contact/logos--github-icon.svg"
              alt="GitHub"
              draggable="false"
            />
          </a>
          <a href="mailto:msc.thanhvu@gmail.com" target="_blank">
            <img
              id="icon-gmail"
              src="/icon/contact/logos--google-gmail.svg"
              alt="Gmail"
              draggable="false"
            />
          </a>
          <a href="https://linkedin.com/in/nguyenthanhvu" target="_blank">
            <img
              id="icon-linked"
              src="/icon/contact/logos--linkedin-icon.svg"
              alt="LinkedIn"
              draggable="false"
            />
          </a>
          <a href="https://t.me/ntvu19" target="_blank">
            <img
              id="icon-telegram"
              src="/icon/contact/logos--telegram.svg"
              alt="Telegram"
              draggable="false"
            />
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
